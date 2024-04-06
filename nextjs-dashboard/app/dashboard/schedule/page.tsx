'use client'
import {
  WorkWeek, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, EventSettingsModel, ResourcesDirective, ResourceDirective, Inject
} from '@syncfusion/ej2-react-schedule';
import { TeamData, fetchTeamData, fetchScheduleData } from './datasource';
import { useEffect, useState } from 'react';

export default function Page() {
  const [dataSource, setDataSource] = useState<Object[] | undefined>(undefined);
  const [teamData, setTeamData] = useState<TeamData[] | undefined>(undefined);

  useEffect(() => {
    fetchScheduleData().then(setDataSource);
  }, []);

  useEffect(() => {
    fetchTeamData().then(setTeamData);
  }, []);

  const eventSettings: EventSettingsModel = { dataSource };
  const group = { byGroupID: false, resources: ['Teams'] };
  return (
    <>
      <h2>Schedule</h2>
      <ScheduleComponent height='550px' currentView='WorkWeek' selectedDate={new Date(2024, 2, 31)} eventSettings={eventSettings} group={group}
                         startHour='06:00' endHour='22:00' allowResizing={false} readonly>
        <ViewsDirective>
          <ViewDirective option='WorkWeek' />
          <ViewDirective option='Agenda' />
        </ViewsDirective>
        <ResourcesDirective>
          <ResourceDirective field='TeamId' title='Team' name='Teams' allowMultiple={false} dataSource={teamData} />
        </ResourcesDirective>
        <Inject services={[WorkWeek, Agenda]} />
      </ScheduleComponent>
    </>
  )
}
