import { NextRequest, NextResponse } from 'next/server';
import { jwt } from 'services/jwt';
import { createSupabaseServer } from 'services/supabase';
import { authMiddleware } from 'utils/auth-middleware';

export async function GET(request: NextRequest) {
  	const { supabase } = createSupabaseServer();
	const { data: { session } } = await supabase.auth.getSession();
	if (!session) return new NextResponse('Unauthorized', { status: 401, ...cors() });

    const requestUrl = new URL(request.url);
    const subscription = requestUrl.searchParams.get('subscription');
    const { supabase } = createSupabaseServer();

    if (subscription) {
      const tokens = await jwt.sign({ subscription });
      await supabase.auth.updateUser({ data: { subscription: tokens } });
      await supabase.auth.refreshSession();
      return NextResponse.redirect(`${requestUrl.origin}/dash`);
    }

    return NextResponse.redirect(`${requestUrl.origin}/login`);
  });
}
