import { cookies } from 'next/headers';
import { supabase } from 'services/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dash')) {
    const cookieStore = cookies();
    const token = cookieStore.get('__AUTH')?.value;
    if (!token || token === 'null')
      return NextResponse.rewrite(new URL('/login', request.url));

    const isInvalid = await supabase.auth
      .getUser(token)
      .then((res) =>
        res.error && res.error?.message.includes('token is expired')
          ? false
          : !res.error
          ? false
          : true,
      )
      .catch(() => true);

    if (isInvalid) {
      // cookieStore.delete('__AUTH');
      return NextResponse.rewrite(new URL('/login', request.url));
    }
  }
}
