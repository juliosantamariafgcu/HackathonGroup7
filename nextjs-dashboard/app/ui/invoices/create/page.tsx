import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchEmployees } from '@/app/lib/data';
import { Employee } from '@/app/lib/definitions';

export default function Page({ employee }: { employee: Employee[] }) {
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

export async function getServerSideProps() {
  try {
    const fetchedEmployees = await fetchEmployees();
    return {
      props: {
        employee: fetchedEmployees,
      },
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return {
      props: {
        employee: [],
      },
    };
  }
}
