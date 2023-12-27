import { NextRequest, NextResponse } from 'next/server';
import { jwt } from 'services/jwt';
import { createSupabaseServer } from 'services/supabase';
import { cors } from 'utils/cors';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { supabase, cookies } = createSupabaseServer(
    undefined,
    process.env.SUPABASE_SECRET!,
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session?.user.id !== params?.id)
    return new NextResponse('Unauthorized', { status: 401, ...cors() });

  const { data, error } = await supabase.auth.admin.deleteUser(params.id);
  if (error) throw new Response('Error on delete user', { status: 500 });

  cookies.getAll().forEach((cookie) => cookies.delete(cookie.name));

  return Response.json(`${data.user.id} was deleted`, {
    status: 200,
    ...cors(),
  });
}
