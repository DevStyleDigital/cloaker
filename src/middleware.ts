import { NextRequest, NextResponse } from 'next/server';
import { jwt } from 'services/jwt';
import { createSupabaseServer } from 'services/supabase';
import { cors } from 'utils/cors';

export async function middleware(req: NextRequest) {
  const { supabase, response } = createSupabaseServer(req);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (
    req.nextUrl.pathname.startsWith('/dash') &&
    !req.nextUrl.pathname.startsWith('/dash/account') &&
    !error &&
    session
  ) {
    const tokens = session.user.user_metadata.subscription;

    const subscription = await jwt
      .verify(tokens?.token || '', tokens?.secret || '')
      .then((r) => r)
      .catch(() => null);

    if (!subscription?.subscription) {
      req.nextUrl.pathname = '/dash/account';
      return NextResponse.redirect(req.nextUrl, { headers: response.headers });
    }
  }

  if (req.nextUrl.pathname.startsWith('/dash') && (error || !session)) {
    req.nextUrl.pathname = '/login';
    return NextResponse.redirect(req.nextUrl, { headers: response.headers });
  }

  if (
    (req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/signup')) &&
    !error &&
    session
  ) {
    req.nextUrl.pathname = '/dash';
    return NextResponse.redirect(req.nextUrl, { headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
