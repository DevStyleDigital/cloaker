import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookiesStore });
  const data = await request
    .json()
    .then((d) => d)
    .catch(() => null);

  const { data: session, error } = await supabase.auth.getSession();
  if (error || !session.session)
    throw new Response('Not Authorized', {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  const { error: updateError } = await supabase.auth.updateUser({
    password: data?.password,
  });

  if (updateError)
    throw Response.json(
      { success: false },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    );

  await supabase.auth.signOut();

  return Response.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN_ORIGIN!,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  );
}
