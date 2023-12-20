import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookiesStore });

  const { error } = await supabase.auth.getSession();

  if (error)
    throw new Response('Not Authorized', {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

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
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
