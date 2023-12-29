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
  if (!session)
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

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
      await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_ORIGIN}/api/cards`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: req.headers,
      });

    return NextResponse.json({ message: 'success' }, { status: 200, ...cors() });
  } catch (err) {
    console.log(err);
    throw NextResponse.json({ message: 'error' }, { status: 500, ...cors() });
  }
}
