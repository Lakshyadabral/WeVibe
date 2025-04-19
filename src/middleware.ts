import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  console.log(" Auth middleware triggered");
  console.log(" User:", req.auth?.user);

  if (pathname.startsWith("/admin")) {
    const userRole = req.auth?.user?.role;
    const userEmail = req.auth?.user?.email;

    console.log("🔒 Admin Access Attempt:", { email: userEmail, role: userRole });

    if (!userRole || userRole !== "Admin") {
      return NextResponse.redirect(
        new URL("/auth/sign-in?message=unauthorized", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
