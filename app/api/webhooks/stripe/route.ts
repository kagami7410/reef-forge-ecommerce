import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';
import { resend } from '@/lib/resend';
import { getOrderConfirmationEmail } from '@/lib/emails/order-confirmation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
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

              // Fetch the complete order details to send confirmation email
              const { data: order } = await supabaseAdmin
                .from('orders')
                .select('*')
                .eq('id', foundOrderId)
                .single();

              if (order) {
                try {
                  const emailContent = getOrderConfirmationEmail({
                    orderId: order.id,
                    customerName: order.user_name,
                    customerEmail: order.user_email,
                    items: order.items,
                    subtotal: parseFloat(order.subtotal),
                    shipping: parseFloat(order.shipping || 0),
                    discount: parseFloat(order.discount || 0),
                    discountCode: order.discount_code,
                    total: parseFloat(order.total),
                    shippingAddress: shipping?.address && shipping?.name ? {
                      name: shipping.name,
                      line1: shipping.address.line1,
                      line2: shipping.address.line2 || undefined,
                      city: shipping.address.city,
                      county: shipping.address.state || undefined,
                      postcode: shipping.address.postal_code,
                      country: shipping.address.country,
                    } : undefined,
                  });

                  await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                    to: order.user_email,
                    subject: emailContent.subject,
                    html: emailContent.html,
                  });

                  console.log('Order confirmation email sent to:', order.user_email);
                } catch (emailError) {
                  console.error('Failed to send order confirmation email:', emailError);
                  // Don't fail the webhook if email fails
                }
              }
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

          // Fetch the complete order details to send confirmation email
          const { data: order } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (order) {
            try {
              const emailContent = getOrderConfirmationEmail({
                orderId: order.id,
                customerName: order.user_name,
                customerEmail: order.user_email,
                items: order.items,
                subtotal: parseFloat(order.subtotal),
                shipping: parseFloat(order.shipping || 0),
                discount: parseFloat(order.discount || 0),
                discountCode: order.discount_code,
                total: parseFloat(order.total),
                shippingAddress: shipping?.address && shipping?.name ? {
                  name: shipping.name,
                  line1: shipping.address.line1,
                  line2: shipping.address.line2 || undefined,
                  city: shipping.address.city,
                  county: shipping.address.state || undefined,
                  postcode: shipping.address.postal_code,
                  country: shipping.address.country,
                } : undefined,
              });

              await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: order.user_email,
                subject: emailContent.subject,
                html: emailContent.html,
              });

              console.log('Order confirmation email sent to:', order.user_email);
            } catch (emailError) {
              console.error('Failed to send order confirmation email:', emailError);
              // Don't fail the webhook if email fails
            }
          }
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
