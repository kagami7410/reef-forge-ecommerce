import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update order status to 'paid' in Supabase
        const orderId = session.metadata?.order_id;

        if (orderId) {
          const { error } = await supabaseAdmin
            .from('orders')
            .update({
              status: 'paid',
              stripe_session_id: session.id,
              stripe_payment_intent: session.payment_intent,
            })
            .eq('id', orderId);

          if (error) {
            console.error('Failed to update order status:', error);
          } else {
            console.log(`Order ${orderId} marked as paid`);
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update order status to 'cancelled'
        const orderId = session.metadata?.order_id;

        if (orderId) {
          const { error } = await supabaseAdmin
            .from('orders')
            .update({
              status: 'cancelled',
              stripe_session_id: session.id,
            })
            .eq('id', orderId);

          if (error) {
            console.error('Failed to update order status:', error);
          } else {
            console.log(`Order ${orderId} marked as cancelled`);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log('Payment Intent Succeeded:', paymentIntent.id);
        console.log('Payment Intent Metadata:', paymentIntent.metadata);

        // Get the order ID from metadata
        const orderId = paymentIntent.metadata.order_id;

        if (!orderId) {
          console.error('No order_id in payment intent metadata');
          console.error('Available metadata:', paymentIntent.metadata);

          // Try to find order by payment_intent_id as fallback
          const { data: orders } = await supabaseAdmin
            .from('orders')
            .select('id')
            .eq('payment_intent_id', paymentIntent.id)
            .limit(1);

          if (orders && orders.length > 0) {
            console.log('Found order by payment_intent_id:', orders[0].id);
            const foundOrderId = orders[0].id;

            // Update using the found order
            const shipping = paymentIntent.shipping;
            const updateData: any = {
              status: 'paid',
              stripe_payment_status: paymentIntent.status,
            };

            if (shipping?.address) {
              updateData.shipping_address_line1 = shipping.address.line1 || null;
              updateData.shipping_address_line2 = shipping.address.line2 || null;
              updateData.shipping_city = shipping.address.city || null;
              updateData.shipping_county = shipping.address.state || null;
              updateData.shipping_postcode = shipping.address.postal_code || null;
              updateData.shipping_country = shipping.address.country || null;
            }

            if (shipping?.name) {
              updateData.shipping_name = shipping.name;
            }

            const { error: updateError } = await supabaseAdmin
              .from('orders')
              .update(updateData)
              .eq('id', foundOrderId);

            if (updateError) {
              console.error('Failed to update order:', updateError);
            } else {
              console.log('Order updated successfully via fallback:', foundOrderId);
            }
          } else {
            console.error('Could not find order by payment_intent_id either');
          }
          break;
        }

        // Get shipping details from the payment intent
        const shipping = paymentIntent.shipping;

        // Update order with payment success and shipping address
        const updateData: any = {
          status: 'paid',
          payment_intent_id: paymentIntent.id,
          stripe_payment_status: paymentIntent.status,
        };

        // Add shipping address if available
        if (shipping?.address) {
          updateData.shipping_address_line1 = shipping.address.line1 || null;
          updateData.shipping_address_line2 = shipping.address.line2 || null;
          updateData.shipping_city = shipping.address.city || null;
          updateData.shipping_county = shipping.address.state || null;
          updateData.shipping_postcode = shipping.address.postal_code || null;
          updateData.shipping_country = shipping.address.country || null;
        }

        if (shipping?.name) {
          updateData.shipping_name = shipping.name;
        }

        console.log('Updating order:', orderId);
        console.log('Update data:', updateData);

        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update(updateData)
          .eq('id', orderId);

        if (updateError) {
          console.error('Failed to update order:', updateError);
          console.error('Error details:', JSON.stringify(updateError));
        } else {
          console.log('Order updated successfully:', orderId);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.order_id;

        if (orderId) {
          const { error } = await supabaseAdmin
            .from('orders')
            .update({
              status: 'failed',
              payment_intent_id: paymentIntent.id,
              stripe_payment_status: paymentIntent.status,
            })
            .eq('id', orderId);

          if (error) {
            console.error('Failed to update order status:', error);
          } else {
            console.log(`Order ${orderId} marked as failed`);
          }
        } else {
          console.log('Payment failed:', paymentIntent.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
