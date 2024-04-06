'use server';

import {
  fetchEmployees,
  fetchPendingRequests,
  fetchSchedules,
  fetchTeams,
} from '@/app/lib/data';
import { Request } from '@/app/lib/definitions';
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
  const pendingRequests = await fetchPendingRequests();
  const pendingRequestsMap = new Map<string, Request[]>();
  for (const request of pendingRequests) {
    const key =
      request.employee_email + ',' + request.day_off.toLocaleDateString();
    const already = pendingRequestsMap.get(key) ?? [];
    pendingRequestsMap.set(key, already.concat([request]));
  }

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

        const hoursWorking = schedule[key];
        const requests =
          pendingRequestsMap.get(
            employee.email + ',' + StartTime.toLocaleDateString(),
          ) ?? [];
        let hoursOff = requests.reduce(
          (sum, request) => sum + request.hours_off,
          0,
        );
        hoursOff = Math.min(hoursOff, hoursWorking);

        const WorkStartTime = firstDayOfWeek(schedule.iso_8601_week, CURRENT_YEAR);
        WorkStartTime.setDate(WorkStartTime.getDate() + index);
        WorkStartTime.setHours(9 + hoursOff);

        const EndTime = firstDayOfWeek(schedule.iso_8601_week, CURRENT_YEAR);
        EndTime.setDate(EndTime.getDate() + index);
        EndTime.setHours(9 + hoursWorking);

        const timeOff = {
          Id: employee.email + ',' + schedule.iso_8601_week,
          Subject: employee.name + "(Time Off)",
          StartTime,
          EndTime: WorkStartTime,
          IsAllDay: false,
          TeamId,
        };

        const work = {
          Id: employee.email + ',' + schedule.iso_8601_week,
          Subject: employee.name,
          StartTime: WorkStartTime,
          EndTime,
          IsAllDay: false,
          TeamId,
        };

        const events = [];
        if (hoursOff > 0) events.push(timeOff);
        if (hoursWorking - hoursOff > 0) events.push(work);
        return events;
      });
    })
    .flat(2) satisfies ScheduleData[];
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
