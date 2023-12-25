import { cors } from 'utils/cors';

import Stripe from 'stripe';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookiesStore });
  const stripe = new Stripe(process.env.PAYMENT_KEY!);

  const { error } = await supabase.auth.getSession();

  if (error)
    throw new Response('Not Authorized', {
      status: 401,
      ...cors(),
    });

  try {
    const prices = await stripe.prices.list({
      limit: 3,
    });

    return Response.json(prices.data, {
      status: 200,
      ...cors(),
    });
  } catch {
    return new Response('Error fetching prices', { status: 500, ...cors() });
  }
}
