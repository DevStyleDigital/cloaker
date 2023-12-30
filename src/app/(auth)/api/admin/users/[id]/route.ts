import { NextRequest, NextResponse } from 'next/server';
import { jwt } from 'services/jwt';
import { createSupabaseServer } from 'app/actions/supabase';
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
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

  const { data, error } = await supabase.auth.admin.deleteUser(params.id);
  if (error)
    throw NextResponse.json({ message: 'Error on delete user' }, { status: 500 });

  cookies.getAll().forEach((cookie) => cookies.delete(cookie.name));

  return NextResponse.json(`${data.user.id} was deleted`, {
    status: 200,
    ...cors(),
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { supabase, cookies } = createSupabaseServer(
    undefined,
    process.env.SUPABASE_SECRET!,
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session?.user.id !== params?.id)
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

  const data = await req.json();

  const { data: userUpdated, error } = await supabase.auth.updateUser({
    data,
  });
  if (error)
    throw NextResponse.json({ message: 'Error on update user' }, { status: 500 });

  return NextResponse.json(
    { message: `${userUpdated.user.id} was updated` },
    { status: 200, ...cors() },
  );
}
