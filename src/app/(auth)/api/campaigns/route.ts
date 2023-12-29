import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from 'services/supabase';
import { cors } from 'utils/cors';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

  const data = await req.json();

  const errorCampaign = await supabase
    .from('campaigns')
    .upsert(data)
    .then((res) => {
      if (res.error) return true;
      return false;
    });

  return NextResponse.json(
    { message: errorCampaign ? 'error' : 'success' },
    {
      status: errorCampaign ? 400 : 200,
      ...cors(),
    },
  );
}
