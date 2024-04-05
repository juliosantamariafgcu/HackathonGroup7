import Form from '@/app/ui/request/create-form';
import Breadcrumbs from '@/app/ui/request/breadcrumbs';
import { fetchEmployees } from '@/app/lib/data';
import { AnyEmployee } from '@/app/lib/definitions';
import { NextPage } from 'next';

interface Props {
  employee: AnyEmployee[];
}

const CreateRequestPage: NextPage<Props> = ({ employee }) => {
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
};

export default CreateRequestPage;

export async function getServerSideProps() {
  const employee: AnyEmployee[] = await fetchEmployees();

  return {
    props: {
      employee,
    },
  };
}

