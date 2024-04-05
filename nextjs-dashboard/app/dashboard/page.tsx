import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import { auth } from "../../auth"
import { Employee } from '../lib/definitions';

export default async function Page() {
    const session = await auth();
    const userPTOremaining = (session?.user as Employee | null)?.remaining_paid_time_off ?? null;
  const userPTOyearly = (session?.user as Employee | null)?.yearly_paid_time_off ?? null;

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
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}
