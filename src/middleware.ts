import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Always redirect root path to /home
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/home', request.url));
  }
 
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    "/", "/home"
  ],
};