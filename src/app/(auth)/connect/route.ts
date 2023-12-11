import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookiesStore });
  const connection = request.nextUrl.searchParams.get('connect');

  await supabase.from('connections').update({ ready: true }).eq('id', connection);

  return Response.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  );
}
