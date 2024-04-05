import Form from '@/app/ui/request/create-form';
import Breadcrumbs from '@/app/ui/request/breadcrumbs';
import { fetchEmployees } from '@/app/lib/data';
import { AnyEmployee } from '@/app/lib/definitions';
export async function Page() {
  const employee: AnyEmployee[] = await fetchEmployees();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Request', href: '/dashboard/request' },
          {
            label: 'Create Request',
            href: '/dashboard/request/create',
            active: true,
          },
        ]}
      />
      <Form employee={employee} />
    </main>
  );
}
