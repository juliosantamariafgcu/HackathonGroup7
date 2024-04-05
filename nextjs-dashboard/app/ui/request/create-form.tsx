'use client';
import {AnyEmployee, Employee } from '@/app/lib/definitions';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createRequest } from '@/app/lib/actions';
import { SetStateAction, useState} from 'react';

export default function Form({ employee }: { employee: AnyEmployee[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createRequest, initialState);

  const [selectedDate, setSelectedDate] = useState<string>(''); // Set the type as string

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const formData = new FormData();
    formData.append('amount', event.currentTarget.amount.value);
    formData.append('reason', event.currentTarget.reason.value);
    formData.append('date', selectedDate);

    const result = await createRequest({ errors: {}, message: null }, formData);

    if (result.errors) {
      console.log('Validation errors:', result.errors);
    } else if (result.message) {
      console.log('Message:', result.message);
    } else {
      console.log('Request created successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Request Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount of hours
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter hour(s) amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <ClockIcon
                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
            </div>
          </div>
        </div>

        {/* Reason Selection */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the reason
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <label
                htmlFor="reason"
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                Select a reason:
              </label>
              <select
                id="reason"
                name="reason"
                className="border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 px-2 py-1 rounded-md"
              >
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
                <option value="Vacation">Vacation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Date Selection */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Select a date in the current week
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <label
                htmlFor="selectedDate"
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                Select a date:
              </label>
              <select
                id="selectedDate"
                name="selectedDate"
                className="border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 px-2 py-1 rounded-md"
                value={selectedDate}
                onChange={handleDateChange}
              >
                {/* Options for current week dates */}
                <option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </option>
              </select>
            </div>
          </div>
        </fieldset>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/request"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Request</Button>
      </div>
    </form>
  );
}
