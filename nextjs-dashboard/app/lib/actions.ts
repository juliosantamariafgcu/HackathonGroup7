'use server';
import { auth, signIn } from '@/auth';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requestTimeOff } from './data';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const FormSchema = z.object({
  id: z.string(),
  reason: z.string({
    invalid_type_error: 'Please select a reason.',
  }),
  date: z.enum(daysOfWeek),
  hours: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than 0 hours.' })
});

export type State = {
  errors?: {
    reason?: string[];
    hours?: string[];
  };
  message?: string | null;
};

const CreateRequest = FormSchema.omit({ id: true });

export async function createRequest(prevState: State, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: 'Unauthenticated. Failed to Create Request.' };
  }

  const validatedFields = CreateRequest.safeParse({
    hours: formData.get('hours'),
    reason: formData.get('reason'),
    date: formData.get('date')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Request.',
    };
  }

  const { reason, hours, date} = validatedFields.data;
  // To match `getDay`, Monday should have an index of one.
  const dayOfWeek = daysOfWeek.indexOf(date) + 1;
  const dayOff = new Date();
  const difference = dayOfWeek - dayOff.getDay();
  // If the selected day of the week has already passed, select the same day next week.
  dayOff.setDate(dayOff.getDate() + (difference < 0 ? difference + 7 : difference));
  dayOff.setUTCFullYear(dayOff.getFullYear(), dayOff.getMonth(), dayOff.getDate());
  dayOff.setUTCHours(0, 0, 0, 0);

  // Insert data into the database
  try {
    await requestTimeOff({
      reason: reason,
      employee_email: session.user.email,
      day_off: dayOff,
      hours_off: hours,
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Request.',
    };
  }

  // Revalidate the cache for the request page and redirect the user.
  revalidatePath('/dashboard/request');
  redirect('/dashboard/request');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
