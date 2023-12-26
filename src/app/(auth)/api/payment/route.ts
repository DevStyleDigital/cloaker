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

  const {
    error,
    data: { session },
  } = await supabase.auth.getSession();

  if (error || !session)
    throw new Response('Not Authorized', {
      status: 401,
      ...cors(),
    });

  try {
    const paymentSession = await stripe.checkout.sessions.create({
      line_items: [{ price: data.price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/payment/callback?subscription=${data.subscription}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/dash/account?e=error-on-checkout`,
    });

    return Response.json({ url: paymentSession.url }, { status: 200, ...cors() });
  } catch (err) {
    console.log(err);
    throw new Response('Error', { status: 500, ...cors() });
  }
}
