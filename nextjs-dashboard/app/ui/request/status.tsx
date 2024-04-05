import { Request } from '@/app/lib/definitions';
import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function RequestStatus({
  status,
}: {
  status: Request['status'];
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'Pending',
          'bg-green-500 text-white': status === 'Approved',
          'bg-red-500 text-white': status === 'Rejected',
        },
      )}
    >
      {status === 'Pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'Approved' ? (
        <>
          Approved
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'Rejected' ? (
        <>
          Rejected
          <XMarkIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
