import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ["/"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log("Middleware triggered")


  if (
    (url.pathname.startsWith('/'))
  ) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}