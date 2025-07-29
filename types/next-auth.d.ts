import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      username: string;
      walletAddress: string | null;
    } & DefaultSession['user'];
  }
}