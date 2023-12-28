import { NextRequest, NextResponse } from 'next/server';
import { cors } from 'utils/cors';

import Stripe from 'stripe';
import { createSupabaseServer } from 'services/supabase';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return new NextResponse('Unauthorized', { status: 401, ...cors() });

  const stripe = new Stripe(process.env.PAYMENT_KEY!);
  const data = await req.json();

  try {
    const paymentSession = await stripe.checkout.sessions.create({
      line_items: [{ price: data.price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/payment/callback?subscription=${data.subscription}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/dash/account?e=error-on-checkout`,
    });

    return Response.json({ url: paymentSession.url }, { status: 200, ...cors() });
  } catch (err) {
    throw new Response('Error', { status: 500, ...cors() });
  }
}
