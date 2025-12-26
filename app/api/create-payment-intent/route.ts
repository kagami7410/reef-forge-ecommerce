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
        { error: 'Unauthorized - Please sign in to checkout' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, subtotal, tax, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
        items: JSON.stringify(items),
        subtotal: subtotal.toString(),
        tax: tax.toString(),
      },
    });

    // Create order in Supabase with pending status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email,
          items: items,
          subtotal: subtotal,
          tax: tax,
          total: total,
          status: 'pending',
          payment_intent_id: paymentIntent.id,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error('Supabase error:', orderError);
      // Cancel the payment intent if order creation fails
      await stripe.paymentIntents.cancel(paymentIntent.id);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError?.message },
        { status: 500 }
      );
    }

    // Update payment intent metadata with order ID
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        ...paymentIntent.metadata,
        order_id: order.id,
      },
    });

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
