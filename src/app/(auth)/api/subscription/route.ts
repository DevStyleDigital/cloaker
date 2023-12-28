import { NextRequest } from 'next/server';
import { jwt } from 'services/jwt';
import { cors } from 'utils/cors';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const subscription = await jwt
    .verify(data.token, data.secret)
    .then((r) => r.subscription)
    .catch(() => null);

  return Response.json(
    { subscription },
    {
      status: !subscription ? 400 : 200,
      ...cors(),
    },
  );
}
