'use server';
import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

  // Insert data into the database
  try {
    await sql`
      INSERT INTO request (employee_email, made_on, reason, date_off, hours_off)
      VALUES (user, current_date, ${reason}, ${date}, ${hours})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create request.',
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
