'use server';

import { fetchEmployees, fetchSchedules, fetchTeams } from '@/app/lib/data';
import { firstDayOfWeek, uniqueColorFromString } from '@/app/lib/utils';

const CURRENT_YEAR = 2024;
const MANAGEMENT_TEAM_ID = '__management';

export type ScheduleData = {
  Id: number | string;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay: boolean;
  TeamId: number | string;
};

export async function fetchScheduleData() {
  const schedules = await fetchSchedules();
  const employees = await fetchEmployees();
  const employeeMap = new Map(
    employees.map((employee) => [employee.email, employee]),
  );
  return schedules
    .map((schedule) => {
      const keys = [
        'monday_hours',
        'tuesday_hours',
        'wednesday_hours',
        'thursday_hours',
        'friday_hours',
      ] as const;
      return keys.map((key, index) => {
        const employee = employeeMap.get(schedule.employee_email)!;
        const TeamId = employee.role == 'Manager' ? MANAGEMENT_TEAM_ID : employee.team_name;

        const StartTime = firstDayOfWeek(schedule.iso_8601_week, CURRENT_YEAR);
        StartTime.setDate(StartTime.getDate() + index);
        StartTime.setHours(9);

        const EndTime = firstDayOfWeek(schedule.iso_8601_week, CURRENT_YEAR);
        EndTime.setDate(EndTime.getDate() + index);
        EndTime.setHours(9 + schedule[key]);

        return {
          Id: employee.email + '|' + schedule.iso_8601_week,
          Subject: employee.name,
          StartTime,
          EndTime,
          IsAllDay: false,
          TeamId,
        };
      });
    })
    .flat() satisfies ScheduleData[];
}

export type TeamData = {
  // https://ej2.syncfusion.com/react/documentation/api/schedule/resources/#textfield
  Text: string;
  // https://ej2.syncfusion.com/react/documentation/api/schedule/resources/#idfield
  Id: string;
  // https://ej2.syncfusion.com/react/documentation/api/schedule/resources/#colorfield
  Color: string;
};

export async function fetchTeamData() {
  const teams = await fetchTeams();
  return teams
    .map((team) => ({
      Text: team.name,
      Id: team.name,
      Color: uniqueColorFromString(team.name),
    }))
    .concat([
      {
        Text: 'Management',
        Id: MANAGEMENT_TEAM_ID,
        Color: uniqueColorFromString('Management'),
      },
    ]) satisfies TeamData[];
}
