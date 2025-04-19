// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  // 👇 minimal placeholder just to satisfy middleware type check
  providers: [
    {
      id: "credentials",
      type: "credentials",
      name: "Credentials",
      credentials: {},
      authorize: async () => null,
    }
  ],
} satisfies NextAuthConfig;

export const authOptions = authConfig;
