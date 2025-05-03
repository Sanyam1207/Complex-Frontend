import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Always redirect root path to /home
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/home', '/login', '/register', '/api/auth']; 
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // If no token and trying to access protected route, redirect to homepage
  if (!token && !isPublicRoute) {
    // Create URL for the destination (homepage with a query param to show login)
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [

  ],
};