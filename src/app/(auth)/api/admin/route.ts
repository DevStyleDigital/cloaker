import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { jwt } from 'services/jwt';
import { createSupabaseServer } from 'app/actions/supabase';
import { cors } from 'utils/cors';
import { getUser } from 'utils/get-user';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer(undefined, process.env.SUPABASE_SECRET!);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let subscription;
  if (
    typeof session?.user?.user_metadata?.subscription?.token === 'string' &&
    typeof session?.user?.user_metadata?.subscription?.secret === 'string'
  )
    subscription = await jwt
      .verify(
        session?.user?.user_metadata.subscription.token,
        session?.user?.user_metadata.subscription.secret,
      )
      .then((r) => r.subscription)
      .catch(() => null);

  if (!session || subscription !== process.env.NEXT_PUBLIC_ADMIN_ROLE)
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

  const data = await req.json();

  const users = await supabase.auth.admin
    .listUsers(data)
    .then(async ({ data, error }) => {
      return error
        ? []
        : await Promise.all(data.users.map(async (u) => await getUser(u, supabase)));
    })
    .catch(() => []);

  return NextResponse.json(users, {
    status: 200,
    ...cors(),
  });
}
