// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
export type Team = {
  name: string;
  description: string;
};

export type Employee = {
  email: string;
  name: string;
  password: string;
  // `yearly_paid_time_off` cannot be negative.
  yearly_paid_time_off: number;
  // `remaining_paid_time_off` cannot be negative.
  remaining_paid_time_off: number;
};

export type NonManager = Employee & {
  team_name: string;
  role: 'Employee' | 'Team Leader';
};

export type Manager = Employee & {};

export type AnyEmployee = NonManager | (Manager & { role: 'Manager' });

export type Schedule = {
  employee_email: string;
  iso_8601_week: number;
  // `monday_hours` cannot be negative.
  monday_hours: number;
  // `tuesday_hours` cannot be negative.
  tuesday_hours: number;
  // `wednesday_hours` cannot be negative.
  wednesday_hours: number;
  // `thursday_hours` cannot be negative.
  thursday_hours: number;
  // `friday_hours` cannot be negative.
  friday_hours: number;
};

export type Request = {
  employee_email: string;
  made_on: Date;
  reason: string;
  day_off: Date;
  hours_off: number;
  status: 'Pending' | 'Approved' | 'Rejected';
};
