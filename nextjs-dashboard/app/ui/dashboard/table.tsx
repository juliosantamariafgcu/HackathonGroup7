import Image from 'next/image';
import { fetchEmployees } from '@/app/lib/data';

export default async function RequestsTable({ query, currentPage, }: {
  query: string;
  currentPage: number;
}) {
  const allEmployees = await fetchEmployees();
  let employeeMap = new Map(
    allEmployees.map((employee) => [employee.email, employee]),
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mb-2 flex items-center">
            <Image
              src={'/customers/emil-kowalski.png'}
              className="mr-2 rounded-full"
              width={28}
              height={28}
              alt={`${employeeMap.get(request.employee_email)?.name}'s profile picture`}
            />
            <p>{employeeMap.get(request.employee_email)?.name}</p>
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                Employee
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Email
              </th>
            </tr>
            </thead>
            <tbody className="bg-white">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
