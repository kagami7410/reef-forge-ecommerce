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
    const { items, subtotal, shipping, discount, discountCode, total } = body;

    console.log('=== Payment Intent Request ===');
    console.log('User:', user.id, user.email);
    console.log('Items count:', items?.length);
    console.log('Items:', JSON.stringify(items, null, 2));
    console.log('Subtotal:', subtotal);
    console.log('Shipping:', shipping);
    console.log('Discount:', discount, 'Code:', discountCode);
    console.log('Total:', total);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate minimum amount for GBP (£0.30 = 30 pence)
    const MINIMUM_AMOUNT_GBP = 0.30;
    if (total < MINIMUM_AMOUNT_GBP) {
      return NextResponse.json(
        { error: `Minimum order amount is £${MINIMUM_AMOUNT_GBP.toFixed(2)}` },
        { status: 400 }
      );
    }

    // Create a payment intent
    console.log('Creating Stripe payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to pence
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
        item_count: items.length.toString(),
        subtotal: subtotal.toString(),
        shipping: shipping?.toString() || '0',
        discount: discount?.toString() || '0',
        discount_code: discountCode || '',
        total: total.toString(),
      },
    });
    console.log('Payment intent created:', paymentIntent.id);

    // Create order in Supabase with pending status
    console.log('Creating order in Supabase...');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email,
          items: items,
          subtotal: subtotal,
          shipping: shipping || 0,
          tax: 0,
          discount: discount || 0,
          discount_code: discountCode || null,
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
        paymentIntentId: paymentIntent.id,
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('=== Payment intent creation error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
