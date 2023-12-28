import { NextRequest, NextResponse } from 'next/server';
import { cors } from 'utils/cors';

import Stripe from 'stripe';
import { createSupabaseServer } from 'services/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { jwt } from 'services/jwt';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new NextResponse('Unauthorized', { status: 401, ...cors() });

  const stripe = new Stripe(process.env.PAYMENT_KEY!);
  const data = await req.json();

  try {
    const paymentMethod = data.card
      ? await stripe.paymentMethods.attach(data.card, { customer: data.cid })
      : await stripe.paymentMethods.create({
          type: 'card',
          billing_details: {
            email: data.email,
            name: data.name,
          },
          card: {
            // number: data.number,
            // exp_month: data.month,
            // exp_year: data.year,
            // cvc: data.cvc,
            token: 'tok_visa',
          },
        });

    await stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      customer: data.cid,
      amount: data.price + 50,
      currency: 'BRL',
      confirmation_method: 'manual',
      confirm: true,
      receipt_email: data.email,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/dash`,
    });

    const tokens = await jwt.sign({ subscription: data.subscription });
    await supabase.auth.updateUser({ data: { subscription: tokens } });

    if (data.priority)
      await fetch('/api/cards', {
        method: 'POST',
        body: JSON.stringify({
          brand: data.cardType,
          name: data.name,
          year: data.year,
          month: data.month,
          cvc: data.cvc,
          number: data.number,
          cid: data.cid,
          priority: data.priority,
          old_card_primary: data.old_card_primary,
        }),
      });

    return Response.json({ message: 'success' }, { status: 200, ...cors() });
  } catch (err) {
    console.log(err);
    throw new Response('error', { status: 500, ...cors() });
  }
}
