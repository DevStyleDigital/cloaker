import { cors } from 'utils/cors';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServer } from 'app/actions/supabase';

export async function GET(req: NextRequest) {
  const { supabase } = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401, ...cors() });

  const stripe = new Stripe(process.env.PAYMENT_KEY!);

  try {
    const prices = await stripe.prices.list({
      limit: 3,
    });

    return NextResponse.json(prices.data, { status: 200, ...cors() });
  } catch (err) {
    throw NextResponse.json(
      { message: 'Error fetching prices' },
      { status: 500, ...cors() },
    );
  }
}
