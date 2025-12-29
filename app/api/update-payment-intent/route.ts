import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentIntentId, subtotal, discount, discountCode } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    const total = subtotal - (discount || 0);

    // Update the payment intent with new amount
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: Math.round(total * 100), // Convert to cents
      metadata: {
        subtotal: subtotal.toString(),
        discount: discount?.toString() || '0',
        discount_code: discountCode || '',
        total: total.toString(),
      },
    });

    // Update the order in Supabase
    await supabase
      .from('orders')
      .update({
        discount: discount || 0,
        discount_code: discountCode || null,
        total: total,
      })
      .eq('payment_intent_id', paymentIntentId);

    return NextResponse.json(
      { success: true, amount: total },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment intent update error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment intent' },
      { status: 500 }
    );
  }
}
