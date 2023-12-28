import { NextRequest, NextResponse } from 'next/server';
import { cors } from 'utils/cors';

import Stripe from 'stripe';
import { formatBrand } from 'utils/credit-card-type';
import { createSupabaseServer } from 'services/supabase';

export async function POST(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new NextResponse('Unauthorized', { status: 401, ...cors() });

  const stripe = new Stripe(process.env.PAYMENT_KEY!);
  const data = await req.json();

  try {
    if (data.old_card_primary)
      await stripe.customers.updateSource(data.cid, data.old_card_primary, {
        metadata: { priority: 'secondary' },
      });

    const card = await stripe.customers.createSource(data.cid, {
      // source: {
      //   exp_month: data.month,
      //   exp_year: data.year,
      //   number: data.number,
      //   cvc: data.cvc,
      //   object: 'card',
      //   currency: 'BRL',
      //   name: data.name,
      // } as any,
      metadata: { priority: data.priority },
      source: data.brand === 'visa' ? 'tok_visa' : 'tok_mastercard',
      validate: true,
    });

    return Response.json(
      {
        id: card.id,
        last_four_digits: data.number.slice(-4),
        priority: data.priority,
        company: data.brand,
      },
      { status: 201, ...cors() },
    );
  } catch (err) {
    throw new Response('Error creating card', { status: 500, ...cors() });
  }
}

export async function DELETE(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new NextResponse('Unauthorized', { status: 401, ...cors() });

  const stripe = new Stripe(process.env.PAYMENT_KEY!);
  const data = await req.json();

  try {
    await stripe.customers.deleteSource(data.cid, data.id);
    if (data.new_card_primary)
      await stripe.customers.updateSource(data.cid, data.new_card_primary, {
        metadata: { priority: 'primary' },
      });
    return Response.json({ message: 'success' }, { status: 200, ...cors() });
  } catch (err) {
    throw new Response('Error deleting card', { status: 500, ...cors() });
  }
}

export async function GET(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new NextResponse('Unauthorized', { status: 401, ...cors() });

  const stripe = new Stripe(process.env.PAYMENT_KEY!);
  const cid = req.nextUrl.searchParams.get('cid');

  try {
    if (!cid) throw '';
    const cards = await stripe.customers.listSources(cid, {
      object: 'card',
    });

    return Response.json(
      cards.data.map((card: any) => ({
        id: card.id,
        last_four_digits: card.last4,
        priority: card.metadata.priority,
        company: formatBrand((card.brand as string).toLowerCase()) || 'visa',
        paymentId: cid,
      })),
      { status: 200, ...cors() },
    );
  } catch (err) {
    throw new Response('Error fetching cards', { status: 500, ...cors() });
  }
}
