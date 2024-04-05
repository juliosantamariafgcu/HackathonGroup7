import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import { auth } from "../../auth"
import { fetchEmployee, fetchEmployees } from '../lib/data';
import { Suspense } from 'react';
import Table from '../ui/request/table';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';

export default async function Page({searchParams,}:
{
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Users must be signed in to view the dashboard.\n" + "This is enforced by 'auth.config.ts'.");
  }

  const employee = await fetchEmployee(session.user.email);
  const userPTOremaining = employee.remaining_paid_time_off;
  const userPTOyearly = employee.yearly_paid_time_off;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <Card title="Your Yearly PTO" value={userPTOyearly} type="collected"/>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <Card title="Your Remaining PTO" value={userPTOremaining} type="collected"/>
      </div>
      <Suspense key={query + currentPage} fallback={<LatestInvoicesSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}
