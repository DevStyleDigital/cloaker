import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookiesStore });
  const connection = request.nextUrl.searchParams.get('connect');

  const { data, error } = await supabase
    .from('connections')
    .upsert({ ready: true, id: connection });

  console.log(connection, data, error);
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
