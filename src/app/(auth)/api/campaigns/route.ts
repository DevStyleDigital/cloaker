import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from 'services/supabase';
import { cors } from 'utils/cors';
import { jwt } from 'services/jwt';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session || !session?.user?.user_metadata?.subscription)
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

  const tokens = session.user.user_metadata.subscription;

  const subscription = await jwt
    .verify(tokens?.token || '', tokens?.secret || '')
    .then((r) => r?.subscription)
    .catch(() => null);

  const data = await req.json();

  const errorCampaign = await supabase
    .from('campaigns')
    .upsert({
      ...data,
      useCustomDomain: ['basic'].includes(subscription || 'basic')
        ? false
        : data.useCustomDomain,
      redirectType: ['basic' || 'premium'].includes(subscription || 'basic')
        ? 'simple'
        : data.redirectType,
    })
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
