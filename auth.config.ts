import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signUp: "/signUp",
  },
  providers: [],
} as NextAuthConfig
