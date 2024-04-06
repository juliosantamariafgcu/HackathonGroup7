import { QueryResultRow, db, sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  Team,
  Employee,
  NonManager,
  Manager,
  AnyEmployee,
  Schedule,
  Request,
} from './definitions';

function getClient() {
  // Connect using a client from the pool.
  return db.connect();
}

async function query<R extends QueryResultRow = any, I extends any[] = any[]>(
  queryText: string,
  values?: I,
) {
  // Connect using a client from the pool.
  const client = await getClient();
  try {
    // Execute the query.
    return await client.query<R, I>(queryText, values);
  } finally {
    // Release the client back into the pool.
    client.release();
  }
}

// Request hours off for an employee given their email address.
// NOTE: The year, month, and day are taken from `request.day_off` in UTC.
export async function requestTimeOff(
  request: Omit<Request, 'made_on' | 'status' | 'name'>,
) {
  const client = await getClient();
  try {
    await client.sql`BEGIN`;
    await client.sql`
      INSERT INTO requests (employee_email, made_on, reason, day_off, hours_off)
      VALUES (
        ${request.employee_email},
        ${new Date().toISOString()},
        ${request.reason},
        ${request.day_off.toISOString().split('T')[0]},
        ${request.hours_off}
      );
    `;
    await client.sql`COMMIT`;
  } catch (error) {
    await client.sql`ROLLBACK`;
    const { employee_email: email } = request;
    console.error(`Failed to request time off for '${email}':`, error);
    throw new AggregateError(
      [error],
      `Failed to request time off for '${email}'.`,
    );
  } finally {
    client.release();
  }
}

// `day_off` is represented by `Date` at midnight local time, not midnight UTC.
export async function fetchPendingRequests() {
  noStore();

  try {
    const pendingRequests = await sql`
      SELECT *
      FROM requests
      WHERE status = 'Pending';
    `;
    return pendingRequests.rows.map((request) => ({
      ...request,
      hours_off: Number.parseFloat(request.hours_off),
    })) as Request[];
  } catch (error) {
    console.error('Failed to fetch pending requests:', error);
    throw new AggregateError([error], 'Failed to fetch pending requests.');
  }
}

// Fetch all employees. Different types of employees can be differentiated by
// examining the `role` property. Each non-manager employees always has a
// `role` equal to 'Employee' or 'Team Leader'. Managers don't have a `role`
// attribute in the database, but the `role` property is reused and equals
// 'Manager' for all managers returned by this function.
export async function fetchEmployees() {
  noStore();

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
  noStore();

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
  noStore();

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
  noStore();

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

// Add a team to the database.
export async function addTeam(team: Team) {
  try {
    const result = await query('INSERT INTO teams VALUES ($1, $2);', [
      team.name,
      team.description,
    ]);
    if (result.rowCount == 0) {
      throw new Error(`Failed to add team '${team.name}'`);
    }
  } catch (error) {
    console.error('Failed to add team:', error);
    throw new AggregateError([error], 'Failed to add team.');
  }
}

// Add an employee to the database.
// The employee should be made into a manager or non-manager later.
export async function addEmployee(employee: Employee) {
  try {
    const result = await query(
      `
        INSERT INTO employees
        VALUES ($1, $2, $3, $4, $5);
      `,
      [
        employee.email,
        employee.name,
        employee.password,
        employee.yearly_paid_time_off.toFixed(2),
        employee.remaining_paid_time_off.toFixed(2),
      ],
    );
    if (result.rowCount == 0) {
      throw new Error(`Failed to add employee '${employee.email}'`);
    }
  } catch (error) {
    console.error('Failed to add employee:', error);
    throw new AggregateError([error], 'Failed to add employee.');
  }
}

// Add a non-manager employee to the database.
export async function addNonManager(nonManager: NonManager) {
  const client = await getClient();
  try {
    await query('BEGIN');
    await query(
      `
        INSERT INTO employees
        VALUES ($1, $2, $3, $4, $5);
      `,
      [
        nonManager.email,
        nonManager.name,
        nonManager.password,
        nonManager.yearly_paid_time_off.toFixed(2),
        nonManager.remaining_paid_time_off.toFixed(2),
      ],
    );
    await query(
      `
        INSERT INTO non_managers
        VALUES ($1, $2, $3);
      `,
      [nonManager.email, nonManager.team_name, nonManager.role],
    );
    const result = await query('COMMIT');
    if (result.rowCount == 0) {
      throw new Error(`Failed to add non-manager '${nonManager.email}'`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Failed to add non-manager:`, error);
    throw new AggregateError([error], `Failed to add non-manager.`);
  } finally {
    client.release();
  }
}

// Add a manager to the database.
export async function addManager(manager: Manager) {
  const client = await getClient();
  try {
    await query('BEGIN');
    await query(
      `
        INSERT INTO employees
        VALUES ($1, $2, $3, $4, $5);
      `,
      [
        manager.email,
        manager.name,
        manager.password,
        manager.yearly_paid_time_off.toFixed(2),
        manager.remaining_paid_time_off.toFixed(2),
      ],
    );
    await query('INSERT INTO managers VALUES ($1);', [manager.email]);
    const result = await query('COMMIT');
    if (result.rowCount == 0) {
      throw new Error(`Failed to add manager '${manager.email}'`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Failed to add manager:`, error);
    throw new AggregateError([error], `Failed to add manager.`);
  } finally {
    client.release();
  }
}

// Add a non-manager or manager to the database.
export function addAnyEmployee(employee: AnyEmployee) {
  if (employee.role == 'Manager') {
    return addManager(employee);
  }
  return addNonManager(employee);
}
