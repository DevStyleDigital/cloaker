import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (
    req.nextUrl.pathname.startsWith('/dash') &&
    !req.nextUrl.pathname.startsWith('/dash/account') &&
    !session?.user.user_metadata.subscription
  )
    return NextResponse.redirect(new URL('/dash/account', req.url));

  if (req.nextUrl.pathname.startsWith('/dash') && (error || !session))
    return NextResponse.redirect(new URL('/login', req.url));

  if (
    (req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/signup')) &&
    !error &&
    session
  )
    return NextResponse.redirect(new URL('/dash', req.url));

  return res;
}
