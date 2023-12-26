import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { cors } from 'utils/cors';
import { v4 as uuid } from 'uuid';

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
    const card = await stripe.customers.createSource(
      session.user.user_metadata.paymentId,
      {
        source: {
          exp_month: data.month,
          exp_year: data.year,
          number: data.number,
          cvc: data.cvc,
          object: 'card',
          currency: 'BRL',
          name: data.name,
        } as any,
        validate: true,
      },
    );

    return Response.json(
      {
        id: card.id,
        last_four_numbers: data.number.slice(-3),
        priority: 'secondary',
      },
      { status: 201, ...cors() },
    );
  } catch (err) {
    console.log(err);

    throw new Response('Error fetching prices', { status: 500, ...cors() });
  }
}

export async function DELETE(req: NextRequest) {
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
    await stripe.customers.deleteSource(data.id, session.user.user_metadata.paymentId);

    return new Response('success', { status: 200, ...cors() });
  } catch (err) {
    // DOO
    throw new Response('Error fetching prices', { status: 500, ...cors() });
  }
}

export async function GET(req: NextRequest) {
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
    const cards = await stripe.customers.listSources(
      session.user.user_metadata.paymentId,
      { object: 'card' },
    );

    return Response.json(
      cards.data.map((card: any) => ({
        id: card.id,
        last_four_digits: card.last4,
        priority: 'secondary',
        company: card.brand,
      })),
      { status: 200, ...cors() },
    );
  } catch (err) {
    throw new Response('Error fetching prices', { status: 500, ...cors() });
  }
}
