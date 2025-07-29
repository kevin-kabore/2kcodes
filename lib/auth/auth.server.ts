import 'server-only';
import { z } from 'zod';
import * as argon2 from 'argon2';
import prisma from '@/lib/db';

// Credentials provider configuration with server-side imports
export const credentialsConfig = {
  id: 'credentials',
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials: Record<string, unknown>) {
    const parsedCredentials = z
      .object({ 
        email: z.string().email(),
        password: z.string().min(6) 
      })
      .safeParse(credentials);

    if (parsedCredentials.success) {
      const { email, password } = parsedCredentials.data;
      
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user || !user.password) return null;
      
      const passwordsMatch = await argon2.verify(user.password, password);
      
      if (passwordsMatch) {
        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      }
    }

    return null;
  },
};