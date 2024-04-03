import { Card } from '@/app/ui/dashboard/cards';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {
    fetchLatestInvoices,
    fetchCardData,
} from '@/app/lib/data';

export default async function Page() {
    const latestInvoices = await fetchLatestInvoices();
    const {
        totalPaidInvoices,
    } = await fetchCardData();

  return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <Card title="Your PTO" value={totalPaidInvoices} type="collected" />
            </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <LatestInvoices latestInvoices={latestInvoices}/>
          </div>
        </main>
    );
}
