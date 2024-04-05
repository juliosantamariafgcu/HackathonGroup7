import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchEmployees } from '@/app/lib/data';
import { AnyEmployee } from '@/app/lib/definitions';
export async function Page() {
  const employee: AnyEmployee[] = await fetchEmployees();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Request', href: '/dashboard/invoices' },
          {
            label: 'Create Request',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form employee={employee} />
    </main>
  );
}
