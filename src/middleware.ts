import { NextRequest, NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: ["/"],
};

export async function middleware(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
