import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { cors } from 'utils/cors';

import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const cookiesStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookiesStore });
  const stripe = new Stripe(process.env.PAYMENT_KEY!);
  const data = await req.json();

  const { error } = await supabase.auth.getSession();

  if (error)
    throw new Response('Not Authorized', {
      status: 401,
      ...cors(),
    });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: data.price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/payment/callback?subscription=${data.subscription}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/dash/account?e=error-on-checkout`,
    });

    return Response.json({ url: session.url }, { status: 200, ...cors() });
  } catch (err) {
    return new Response('Error fetching prices', { status: 500, ...cors() });
  }
}
