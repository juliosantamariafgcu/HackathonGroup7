import Image from 'next/image';
import { fetchEmployees } from '@/app/lib/data';
import { Employee,} from '@/app/lib/definitions';

export default async function EmployeeTable({ query, currentPage }: {
  query: string;
  currentPage: number;
}) {
  const allEmployees: Employee[] = await fetchEmployees();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
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
            {allEmployees.map((employee) => (
              <tr key={employee.email}>
                <td className="px-4 py-4">{employee.name}</td>
                <td className="px-3 py-4">{employee.email}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

