import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from 'services/supabase';
import { authMiddleware } from 'utils/auth-middleware';
import { cors } from 'utils/cors';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return new NextResponse('Unauthorized', { status: 401, ...cors() });

  const { supabase } = createSupabaseServer();
  const data = await req.json();

  const errorCampaign = await supabase
    .from('campaigns')
    .upsert(data)
    .then((res) => {
      if (res.error) return true;
      return false;
    });

  return new Response(errorCampaign ? 'error' : 'success', {
    status: errorCampaign ? 400 : 200,
    ...cors(),
  });
}
