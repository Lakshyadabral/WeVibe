import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  providers: [],
} satisfies NextAuthConfig; 

export const authOptions = authConfig;
