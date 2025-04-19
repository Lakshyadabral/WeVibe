// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const role = req.auth?.user?.role;
    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/auth/sign-in?message=unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
