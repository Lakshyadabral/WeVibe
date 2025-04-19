// src/middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // ✅ Define public routes
  const publicRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/error',
    '/api/auth',
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // ✅ Allow public and static files
  if (
    isPublicRoute ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('.')
  ) {
    return;
  }

  // ✅ Handle custom logout path
  if (nextUrl.pathname === '/auth/sign-out') {
    const response = NextResponse.redirect(new URL('/auth/sign-in', req.url));
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token'); // handle secure cookie
    return response;
  }

  // ✅ Redirect unauthenticated users
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // ✅ Protect /admin route
  if (nextUrl.pathname.startsWith('/admin')) {
    const role = req.auth?.user?.role;
    if (role !== 'Admin') {
      return NextResponse.redirect(new URL('/auth/sign-in?message=unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
