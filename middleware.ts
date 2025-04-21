import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;


  // Define public routes (won't be protected)
  const publicRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',       // Add if you have registration
    '/auth/error',         // Add if you have error pages
    '/api/auth',           // NextAuth API routes
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) => 
    nextUrl.pathname.startsWith(route)
  );

  // Allow public routes and static files
  if (isPublicRoute || 
      nextUrl.pathname.startsWith('/_next') ||
      nextUrl.pathname.includes('.') // static files
  ) {
    return;
  }

  // Add to your existing middleware
  const signOutPaths = ['/auth/sign-out']

  if (signOutPaths.includes(nextUrl.pathname)) {
    const response = NextResponse.redirect('/auth/sign-in')
    response.cookies.delete('next-auth.session-token')
    return response
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    return Response.redirect(new URL('/auth/sign-in', nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};  