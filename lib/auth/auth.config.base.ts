import type { NextAuthConfig } from 'next-auth';
import prisma from '@/lib/db';

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');
      
      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
    async session({ session, token }) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
      }
      
      if (token?.role && session?.user) {
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      
      if (session?.user) {
        session.user.username = token.username as string;
        session.user.walletAddress = token.walletAddress as string | null;
      }
      
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            email: true,
            walletAddress: true,
            role: true,
          },
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.walletAddress = dbUser.walletAddress;
        }
      }
      
      return token;
    },
  },
  providers: [], // Add providers with the actual configuration
} satisfies NextAuthConfig;