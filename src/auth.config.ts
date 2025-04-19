import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import type { NextAuthConfig } from "next-auth";

async function getUser(email: string) {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    return null;
  }
}

const ADMIN_EMAILS = ["lakshya@roommate.com"];

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user || !user.password) return null;

        const match = await bcrypt.compare(password, user.password);
        return match ? user : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider !== "credentials" &&
        ADMIN_EMAILS.includes(user.email ?? "")
      ) {
        console.log("🚫 Blocked OAuth login for admin:", user.email);
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }

      if (!token.role && token.email) {
        const dbUser = await getUser(token.email);
        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
        const dbUser = await getUser(session.user.email!);
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.image = dbUser.image || session.user.image;
        }
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const authOptions = authConfig;
