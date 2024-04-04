import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import * as bcrypt from 'bcrypt-ts';
import { fetchEmployee } from './app/lib/data';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const employee = await fetchEmployee(email);
          if (!employee) return null;
          const passwordsMatch = await bcrypt.compare(password, employee.password);

          if (passwordsMatch) return employee;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
