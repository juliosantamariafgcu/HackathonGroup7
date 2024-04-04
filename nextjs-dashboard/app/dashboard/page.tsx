import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import {fetchEmployee} from '@/app/lib/data';
import { auth } from "../../auth"
import { Employee } from '../lib/definitions';

export default async function Page() {
    const session = await auth();
    const userPTO = (session?.user as Employee | null)?.remaining_paid_time_off ?? null;

  return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <Card title="Your PTO" value={userPTO} type="collected" />
            </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          </div>
        </main>
    );
}
