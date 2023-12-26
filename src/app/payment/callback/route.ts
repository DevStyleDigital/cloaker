import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { jwt } from 'services/jwt';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const subscription = requestUrl.searchParams.get('subscription');
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && subscription) {
    const tokens = await jwt.sign({ subscription });
    await supabase.auth.updateUser({ data: { subscription: tokens } });
    await supabase.auth.refreshSession();
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
