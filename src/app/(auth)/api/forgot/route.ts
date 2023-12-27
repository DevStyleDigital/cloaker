import { type NextRequest } from 'next/server';
import { createSupabaseServer } from 'services/supabase';
import { cors } from 'utils/cors';

export async function POST(request: NextRequest) {
  const { supabase } = createSupabaseServer();
  const data = await request
    .json()
    .then((d) => d)
    .catch(() => null);

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
