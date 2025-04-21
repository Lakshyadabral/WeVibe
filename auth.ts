// auth.ts (must be in root)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db"; // ✅ using db wrapper instead of raw prisma

async function getUser(email: string) {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  adapter: PrismaAdapter(db), // ✅ using db here as well
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("❌ Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user || !user.password) {
          console.log("❌ No user found or user uses OAuth:", email);
          return null;
        }

        try {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            console.log("❌ Password mismatch for:", email);
            return null;
          }

          console.log("✅ Successful login for:", email);
          return user;
        } catch (error) {
          console.error("❌ Error comparing passwords:", error);
          return null;
        }
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }

      // Fetch role from DB if not already present
      if (!token.role && token.email) {
        const dbUser = await getUser(token.email);
        if (dbUser) {
          token.role = dbUser.role;

          // Optional auto-assign admin if somehow missing
          if (!dbUser.role && ["lakshya@roommate.com", "mandeep@roommate.com", "vinas@roommate.com", "tijan@roommate.com"].includes(token.email)) {
            await db.user.update({
              where: { email: token.email },
              data: { role: "Admin" },
            });
            token.role = "Admin";
          }
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
});
