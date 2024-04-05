import Image from 'next/image';
import RequestStatus from '@/app/ui/request/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchEmployees, fetchPendingRequests } from '@/app/lib/data';

function formatHours(hours: number) {
  const unit = hours == 1 ? 'hour' : 'hours';
  return hours + ' ' + unit;
}

export default async function RequestsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const requests = await fetchPendingRequests(/* query, currentPage */);
  const allEmployees = await fetchEmployees();
  let employeeMap = new Map(
    allEmployees.map((employee) => [employee.email, employee]),
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {requests?.map((request) => (
              <div
                key={request.employee_email + request.made_on.toString()}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
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
                    <p className="text-sm text-gray-500">
                      {request.employee_email}
                    </p>
                  </div>
                  <RequestStatus status={request.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatHours(request.hours_off)}
                    </p>
                    <p>{formatDateToLocal(request.day_off)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                  </div>
                </div>
              </div>
            ))}
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Hours
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {requests.map((request) => (
                <tr
                  key={request.employee_email + request.made_on.toString()}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={'/customers/emil-kowalski.png'}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${employeeMap.get(request.employee_email)?.name}'s profile picture`}
                      />
                      <p>{employeeMap.get(request.employee_email)?.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.employee_email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatHours(request.hours_off)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(request.day_off)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <RequestStatus status={request.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
