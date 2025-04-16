import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Define public routes
  const publicRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/error',
    '/api/auth',
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow access to public routes and static files
  if (
    isPublicRoute ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // static files
  ) {
    return;
  }

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // Restrict /admin route to only users with "Admin" role
  if (pathname.startsWith('/admin')) {
    const userRole = req.auth?.user?.role;

    if (userRole !== 'Admin') {
      // Optional: redirect to a "not authorized" page or home
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  if (pathname.startsWith('/onboarding')) {
    const userProfileComplete = req.auth?.user?.profileComplete;

    if (userProfileComplete) {
      // Optional: redirect to a "not authorized" page or home
      return NextResponse.redirect(new URL('/home', req.url));
    }
  }

  // Handle logout and delete cookies
  if (pathname === '/auth/sign-out') {
    const response = NextResponse.redirect(new URL('/auth/sign-in', req.url));

    const cookieNames = [
      'authjs.session-token',
      '__Secure-authjs.session-token',
      'authjs.csrf-token',
      '__Host-authjs.csrf-token',
      'authjs.callback-url',
    ];

    for (const name of cookieNames) {
      response.cookies.delete(name);
    }

    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
