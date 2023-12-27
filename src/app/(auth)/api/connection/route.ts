import { type NextRequest } from 'next/server';
import { createSupabaseServer } from 'services/supabase';

export async function POST(request: NextRequest) {
  const { supabase } = createSupabaseServer();
  const connection = request.nextUrl.searchParams.get('connect');
  const data = await request
    .json()
    .then((d) => d)
    .catch(() => null);

  await supabase
    .from('connections')
    .upsert(data ? data : { ready: true, id: connection });

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
