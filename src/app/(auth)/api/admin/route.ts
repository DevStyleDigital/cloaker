import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { cors } from 'utils/cors';
import { getUser } from 'utils/get-user';

export async function POST(req: NextRequest) {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient(
    {
      cookies: () => cookiesStore,
    },
    {
      supabaseKey: process.env.SUPABASE_SECRET,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (
    !session ||
    error ||
    session.user.user_metadata.subscription !== process.env.NEXT_PUBLIC_ADMIN_ROLE
  )
    throw new Response('unauthorized', {
      status: 401,
      ...cors(),
    });

  const data = await req.json();

  const users = await supabase.auth.admin
    .listUsers(data)
    .then(async ({ data, error }) => {
      return error
        ? []
        : await Promise.all(data.users.map(async (u) => await getUser(u, supabase)));
    })
    .catch(() => []);

  return Response.json(users, {
    status: 200,
    ...cors(),
  });
}
