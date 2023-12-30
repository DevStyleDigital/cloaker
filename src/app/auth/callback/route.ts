import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from 'app/actions/supabase';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const { supabase } = createSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session) {
      cookieStore.delete('resend-try-tomorrow');
      cookieStore.delete('resend-counter');
      cookieStore.delete('confirm-email');
      cookieStore.delete('resend-time');

      const stripe = new Stripe(process.env.PAYMENT_KEY!);
      const sCostumer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.user_metadata.name,
        phone: session.user.user_metadata.phone,
      });

      await supabase.auth.updateUser({ data: { paymentId: sCostumer.id } });

      return NextResponse.redirect(`${requestUrl.origin}/dash/account`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
