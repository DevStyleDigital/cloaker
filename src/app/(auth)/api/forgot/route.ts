import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';
import { cors } from 'utils/cors';

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
      ...cors(),
    });

  const { error: updateError } = await supabase.auth.updateUser({
    password: data?.password,
  });

  if (updateError)
    throw Response.json(
      { success: false },
      {
        status: 400,
        ...cors(),
      },
    );

  await supabase.auth.signOut();

  return Response.json(
    { success: true },
    {
      status: 200,
      ...cors(),
    },
  );
}