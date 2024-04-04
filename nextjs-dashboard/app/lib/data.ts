import { Pool, QueryResultRow } from 'pg';
import {
  Team,
  Employee,
  NonManager,
  Manager,
  AnyEmployee,
  Schedule,
  Request,
} from './definitions';

let globalPool: Pool | null = null;

// TODO(Daniel): Remove this when we switch back to the Vercel Postgres package.
async function query<R extends QueryResultRow = any, I extends any[] = any[]>(
  queryText: string,
  values?: I,
) {
  // If we don't have a global pool yet, create one.
  if (!globalPool) {
    globalPool = new Pool();
  }
  // Connect using a client from the pool.
  const client = await globalPool.connect();
  try {
    // Execute the query.
    return await client.query<R, I>(queryText, values);
  } finally {
    // Release the client back into the pool.
    client.release();
  }
}

// FIXME(Daniel): Implement this.
export async function requestTimeOff() {}

// FIXME(Daniel): Implement this.
export async function fetchPendingRequests() {}

// Fetch all employees. Different types of employees can be differentiated by
// examining the `role` property. Each non-manager employees always has a
// `role` equal to 'Employee' or 'Team Leader'. Managers don't have a `role`
// attribute in the database, but the `role` property is reused and equals
// 'Manager' for all managers returned by this function.
export async function fetchEmployees() {
  try {
    const employees = await query(`
      (
        SELECT
          email, name, password, yearly_paid_time_off, remaining_paid_time_off,
          NULL AS team_name, 'Manager' AS role
        FROM managers
        JOIN employees USING (email)
      ) UNION (
        SELECT
          email, name, password, yearly_paid_time_off, remaining_paid_time_off,
          team_name, role
        FROM non_managers
        JOIN employees USING (email)
      );
    `);
    return employees.rows.map((row) => ({
      ...row,
      yearly_paid_time_off: Number.parseFloat(row.yearly_paid_time_off),
      remaining_paid_time_off: Number.parseFloat(row.remaining_paid_time_off),
    })) as AnyEmployee[];
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    throw new AggregateError([error], 'Failed to fetch employees.');
  }
}

// Fetch a single generic employee given their email address.
export async function fetchEmployee(email: string) {
  try {
    const employee = await query(`SELECT * FROM employees WHERE email=$1;`, [
      email,
    ]);
    if (employee.rows.length == 0) {
      throw new Error(`No employee has the email address '${email}'`);
    }
    const row = employee.rows[0];
    return {
      ...row,
      yearly_paid_time_off: Number.parseFloat(row.yearly_paid_time_off),
      remaining_paid_time_off: Number.parseFloat(row.remaining_paid_time_off),
    } as Employee;
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    throw new AggregateError([error], 'Failed to fetch employee.');
  }
}

// Fetch a single non-manager employee given their email address.
export async function fetchNonManager(email: string) {
  try {
    const nonManager = await query(
      `
        SELECT *
        FROM non_managers
        JOIN employees USING (email)
        WHERE email=$1;
      `,
      [email],
    );
    if (nonManager.rows.length == 0) {
      throw new Error(
        `No non-manager employee has the email address '${email}'`,
      );
    }
    const row = nonManager.rows[0];
    return {
      ...row,
      yearly_paid_time_off: Number.parseFloat(row.yearly_paid_time_off),
      remaining_paid_time_off: Number.parseFloat(row.remaining_paid_time_off),
    } as NonManager;
  } catch (error) {
    console.error('Failed to fetch non-manager employee:', error);
    throw new AggregateError([error], 'Failed to fetch non-manager employee.');
  }
}

// Fetch a single manager given their email address.
export async function fetchManager(email: string) {
  try {
    const manager = await query(
      `
        SELECT *
        FROM managers
        JOIN employees USING (email)
        WHERE email=$1;
      `,
      [email],
    );
    if (manager.rows.length == 0) {
      throw new Error(`No manager has the email address '${email}'`);
    }
    const row = manager.rows[0];
    return {
      ...row,
      yearly_paid_time_off: Number.parseFloat(row.yearly_paid_time_off),
      remaining_paid_time_off: Number.parseFloat(row.remaining_paid_time_off),
    } as Manager;
  } catch (error) {
    console.error('Failed to fetch manager:', error);
    throw new AggregateError([error], 'Failed to fetch manager.');
  }
}
