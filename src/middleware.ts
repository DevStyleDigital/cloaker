import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const session = await supabase.auth.getSession();

  if (
    req.nextUrl.pathname.startsWith('/dash') &&
    (session.error || !session.data.session)
  )
    return NextResponse.rewrite(new URL('/login', req.url));

  if (
    (req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/signup')) &&
    !session.error &&
    session.data.session
  )
    return NextResponse.rewrite(new URL('/dash', req.url));

  return res;
}
