import React from 'react';
import Form from '@/app/ui/request/create-form';
import Breadcrumbs from '@/app/ui/request/breadcrumbs';
import { fetchEmployees } from '@/app/lib/data';
import { AnyEmployee } from '@/app/lib/definitions';

export default async function Page() {
  let employee: AnyEmployee[] = [];

  try {
    employee = await fetchEmployees();
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Handle the error, possibly show a message to the user
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Request', href: '/dashboard/request' },
          {
            label: 'Create Request',
            href: '/dashboard/request',
            active: true,
          },
        ]}
      />
      <Form employee={employee} />
    </main>
  );
}

