import { db } from '@vercel/postgres';
import { teams, employees, requests } from '../app/lib/placeholder-data.js';
import * as bcrypt from 'bcrypt-ts';

// Add teams from the placeholder data file.
// NOTE: Objects created by this function should be dropped by `drop.mjs`.
async function seedTeams(client) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS teams (
      name VARCHAR(127) PRIMARY KEY CHECK (name <> ''),
      description VARCHAR(255) NOT NULL
    );
  `;

  for (const team of teams) {
    await client.sql`INSERT INTO teams VALUES (${team.name}, ${team.description});`;
  }
}

// Add different types of employees from the placeholder data file.
// NOTE: Objects created by this function should be dropped by `drop.mjs`.
async function seedEmployees(client) {
  // NOTE: Passwords must be salted and hashed using bcrypt.
  await client.sql`
    CREATE TABLE IF NOT EXISTS employees (
      email VARCHAR(127) PRIMARY KEY CHECK (email <> ''),
      name VARCHAR(127) NOT NULL CHECK (name <> ''),
      password TEXT NOT NULL,
      yearly_paid_time_off NUMERIC(4, 2) NOT NULL,
      remaining_paid_time_off NUMERIC(4, 2) NOT NULL,
      CHECK (yearly_paid_time_off >= 0),
      CHECK (remaining_paid_time_off >= 0)
    );
  `;

  // As the name implies, a non-manager cannot simultaneously be a manager.
  // This invariant is not enforced by PostgreSQL itself.
  await client.sql`
    CREATE TABLE IF NOT EXISTS non_managers (
      email VARCHAR(127) PRIMARY KEY,
      team_name VARCHAR(127) NOT NULL,
      role TEXT NOT NULL,
      FOREIGN KEY (email) REFERENCES employees,
      FOREIGN KEY (team_name) REFERENCES teams (name),
      CHECK (role IN ('Employee', 'Team Leader'))
    );
  `;

  // A manager cannot simultaneously be a non-manager.
  // This invariant is not enforced by PostgreSQL itself.
  await client.sql`
    CREATE TABLE IF NOT EXISTS managers (
      email VARCHAR(127) PRIMARY KEY,
      FOREIGN KEY (email) REFERENCES employees
    );
  `;

  for (const employee of employees) {
    await client.sql`
      INSERT INTO employees
      VALUES (
        ${employee.email},
        ${employee.name},
        ${await bcrypt.hash(employee.password, 10)},
        ${employee.yearly_paid_time_off.toFixed(2)},
        ${employee.remaining_paid_time_off.toFixed(2)}
      );
    `;

    if (employee.role == 'Manager') {
      await client.sql`INSERT INTO managers VALUES (${employee.email});`;
    } else {
      await client.sql`
        INSERT INTO non_managers
        VALUES (
          ${employee.email},
          ${employee.team_name},
          ${employee.role}
        );
      `;
    }
  }
}

// NOTE: Objects created by this function should be dropped by `drop.mjs`.
async function seedRequests(client) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS requests (
      employee_email VARCHAR(127) NOT NULL,
      made_on TIMESTAMPTZ NOT NULL,
      reason VARCHAR(255) NOT NULL,
      day_off DATE NOT NULL,
      hours_off NUMERIC(4, 2) NOT NULL,
      status TEXT DEFAULT 'Pending' NOT NULL,
      PRIMARY KEY (employee_email, made_on),
      FOREIGN KEY (employee_email) REFERENCES employees (email),
      CHECK (status IN ('Pending', 'Approved', 'Rejected'))
    );
  `;

  for (const request of requests) {
    await client.sql`
      INSERT INTO requests
      VALUES (
        ${request.employee_email},
        ${request.made_on.toISOString()},
        ${request.reason},
        ${request.day_off.toISOString().split('T')[0]},
        ${request.hours_off},
        ${request.status}
      );
    `;
  }
}

// NOTE: Objects created by this function should be dropped by `drop.mjs`.
async function main() {
  const client = await db.connect();

  await seedTeams(client);
  await seedEmployees(client);

  await client.sql`
    CREATE TABLE IF NOT EXISTS schedules (
      employee_email VARCHAR(127) NOT NULL,
      -- https://en.wikipedia.org/wiki/ISO_week_date
      iso_8601_week INT NOT NULL,
      monday_hours INT DEFAULT 0 NOT NULL CHECK (monday_hours >= 0),
      tuesday_hours INT DEFAULT 0 NOT NULL CHECK (tuesday_hours >= 0),
      wednesday_hours INT DEFAULT 0 NOT NULL CHECK (wednesday_hours >= 0),
      thursday_hours INT DEFAULT 0 NOT NULL CHECK (thursday_hours >= 0),
      friday_hours INT DEFAULT 0 NOT NULL CHECK (friday_hours >= 0),
      PRIMARY KEY (employee_email, iso_8601_week),
      FOREIGN KEY (employee_email) REFERENCES employees (email),
      CHECK (iso_8601_week BETWEEN 1 AND 53)
    );
  `;

  await seedRequests(client);

  await client.release();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
