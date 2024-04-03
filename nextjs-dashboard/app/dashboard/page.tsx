'use client';
import { Card } from '@/app/ui/dashboard/cards';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {
    fetchLatestInvoices,
    fetchCardData,
} from '@/app/lib/data';
import {
  Week, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, EventSettingsModel, ResourcesDirective, ResourceDirective, Inject, Resize, DragAndDrop
} from '@syncfusion/ej2-react-schedule';
import { timelineResourceData } from './datasource';

export default async function Page() {
    const latestInvoices = await fetchLatestInvoices();
    const {
        totalPaidInvoices,
    } = await fetchCardData();

  const eventSettings: EventSettingsModel = { dataSource: timelineResourceData }
  const group = { byGroupID: false, resources: ['Projects', 'Categories'] }
  const projectData: Object[] = [
    { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
    { text: 'PROJECT 2', id: 2, color: '#56ca85' },
    { text: 'PROJECT 3', id: 3, color: '#df5286' },
  ];
  const categoryData: Object[] = [
    { text: 'Development', id: 1, color: '#1aaa55' },
    { text: 'Testing', id: 2, color: '#7fa900' }
  ];


  return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <Card title="Your PTO" value={totalPaidInvoices} type="collected" />
            </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">

            <ScheduleComponent selectedDate={new Date(2018, 3, 4)} eventSettings={eventSettings} group={group}>
            </ScheduleComponent>

            <LatestInvoices latestInvoices={latestInvoices}/>

          </div>
        </main>
    );
}
