const teams = [
  Object.freeze({
    name: 'Development',
    description: 'Responsible for designing and implementing applications',
  }),
  Object.freeze({
    name: 'Testing',
    description: 'Responsible for testing applications',
  }),
];

const employees = [
  Object.freeze({
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    password: 'SecurePassword123',
    yearly_paid_time_off: 20,
    remaining_paid_time_off: 15,
    team_name: 'Testing',
    role: 'Employee',
  }),
  Object.freeze({
    email: 'john.smith@example.com',
    name: 'John Smith',
    password: 'SecretPass456',
    yearly_paid_time_off: 15,
    remaining_paid_time_off: 10,
    team_name: 'Testing',
    role: 'Employee',
  }),
  Object.freeze({
    email: 'alice.jones@example.com',
    name: 'Alice Jones',
    password: 'StrongP@ssw0rd',
    yearly_paid_time_off: 18,
    remaining_paid_time_off: 18,
    team_name: 'Development',
    role: 'Employee',
  }),
  Object.freeze({
    email: 'daniel.kareh@example.com',
    name: 'Daniel Kareh',
    password: 'LeaderPass789',
    yearly_paid_time_off: 25,
    remaining_paid_time_off: 20,
    team_name: 'Development',
    role: 'Team Leader',
  }),
  Object.freeze({
    email: 'julio.santamaria@example.com',
    name: 'Julio Santamaria',
    password: 'ManagerPass2024',
    yearly_paid_time_off: 30,
    remaining_paid_time_off: 15,
    role: 'Manager',
  }),
];

const requests = [
  Object.freeze({
    employee_email: 'alice.jones@example.com',
    made_on: new Date(),
    reason: '',
    day_off: new Date('2024-04-05'),
    hours_off: 4,
    status: 'Pending',
  }),
  Object.freeze({
    employee_email: 'jane.doe@example.com',
    made_on: new Date(),
    reason: '',
    day_off: new Date('2024-04-03'),
    hours_off: 3,
    status: 'Pending',
  }),
];

const schedules = [
  Object.freeze({
    employee_email: 'jane.doe@example.com',
    iso_8601_week: 14,
    monday_hours: 6,
    tuesday_hours: 7,
    wednesday_hours: 8,
    thursday_hours: 7,
    friday_hours: 7,
  }),
  Object.freeze({
    employee_email: 'john.smith@example.com',
    iso_8601_week: 14,
    monday_hours: 6,
    tuesday_hours: 6,
    wednesday_hours: 6,
    thursday_hours: 6,
    friday_hours: 8,
  }),
  Object.freeze({
    employee_email: 'alice.jones@example.com',
    iso_8601_week: 14,
    monday_hours: 8,
    tuesday_hours: 7,
    wednesday_hours: 6,
    thursday_hours: 5,
    friday_hours: 4,
  }),
  Object.freeze({
    employee_email: 'daniel.kareh@example.com',
    iso_8601_week: 14,
    monday_hours: 4,
    tuesday_hours: 5,
    wednesday_hours: 6,
    thursday_hours: 7,
    friday_hours: 8,
  }),
  Object.freeze({
    employee_email: 'julio.santamaria@example.com',
    iso_8601_week: 14,
    monday_hours: 8,
    tuesday_hours: 8,
    wednesday_hours: 4,
    thursday_hours: 8,
    friday_hours: 8,
  }),
];

module.exports = { teams, employees, requests, schedules };
