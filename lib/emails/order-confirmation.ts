interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  discountCode?: string | null;
  total: number;
  shippingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
}

export function getOrderConfirmationEmail({
  orderId,
  customerName,
  customerEmail,
  items,
  subtotal,
  shipping,
  discount,
  discountCode,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          <img src="${item.image}" alt="${item.product_name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;" />
          <div>
            <div style="font-weight: 600; color: #333;">${item.product_name}</div>
            <div style="color: #666; font-size: 14px; margin-top: 5px;">Quantity: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
        £${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  const shippingHtml = shippingAddress
    ? `
    <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Shipping Address</h3>
      <div style="color: #666; line-height: 1.6;">
        ${shippingAddress.name ? `<div style="font-weight: 600; color: #333;">${shippingAddress.name}</div>` : ''}
        ${shippingAddress.line1 ? `<div>${shippingAddress.line1}</div>` : ''}
        ${shippingAddress.line2 ? `<div>${shippingAddress.line2}</div>` : ''}
        ${shippingAddress.city || shippingAddress.postcode ? `<div>${[shippingAddress.city, shippingAddress.postcode].filter(Boolean).join(', ')}</div>` : ''}
        ${shippingAddress.county ? `<div>${shippingAddress.county}</div>` : ''}
        ${shippingAddress.country ? `<div>${shippingAddress.country}</div>` : ''}
      </div>
    </div>
  `
    : '';

  return {
    subject: `Order Confirmation - #${orderId.slice(0, 8)}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Logo Section -->
    <div style="background-color: #ffffff; padding: 30px 30px 20px 30px; text-align: center; border-bottom: 1px solid #eee;">
      <img src="https://res.cloudinary.com/drhvaqfux/image/upload/v1767204465/anvil_gsz3tw.png" alt="Reef-Forge Logo" style="max-width: 180px; height: auto;" />
    </div>

    <!-- Header -->
    <div style="background-color: #0066cc; color: white; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Thank You for Your Order!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been confirmed</p>
    </div>

    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #666; margin: 0 0 20px 0;">
        Hi ${customerName},
      </p>
      <p style="font-size: 16px; color: #666; margin: 0 0 30px 0;">
        We've received your order and will notify you when it ships. You can find your order details below.
      </p>

      <!-- Order Details -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #333;">Order Details</h2>
        <p style="margin: 0; color: #666; font-size: 14px;">
          Order ID: <strong>#${orderId.slice(0, 8)}</strong>
        </p>
      </div>

      <!-- Items -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr>
            <th style="text-align: left; padding-bottom: 15px; border-bottom: 2px solid #ddd; color: #333; font-size: 14px; font-weight: 600;">ITEM</th>
            <th style="text-align: right; padding-bottom: 15px; border-bottom: 2px solid #ddd; color: #333; font-size: 14px; font-weight: 600;">PRICE</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="border-top: 2px solid #ddd; padding-top: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="color: #666;">Subtotal:</span>
          <span style="color: #333; font-weight: 600;">£${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="color: #666;">Shipping:</span>
          <span style="color: ${shipping === 0 ? '#22c55e' : '#333'}; font-weight: 600;">${shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}</span>
        </div>
        ${
          discount > 0
            ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="color: #22c55e;">Discount ${discountCode ? `(${discountCode})` : ''}:</span>
          <span style="color: #22c55e; font-weight: 600;">-£${discount.toFixed(2)}</span>
        </div>
        `
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #ddd; margin-top: 15px;">
          <span style="color: #333; font-size: 18px; font-weight: 700;">Total:</span>
          <span style="color: #333; font-size: 18px; font-weight: 700;">£${total.toFixed(2)}</span>
        </div>
      </div>

      ${shippingHtml}

      <!-- Help -->
      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee; text-align: center;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
          Questions about your order? We're here to help!
        </p>
        <p style="color: #666; font-size: 14px; margin: 0;">
          Contact us at <a href="mailto:info@reef-forge.uk" style="color: #0066cc; text-decoration: none;">info@reef-forge.uk</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
      <img src="https://res.cloudinary.com/drhvaqfux/image/upload/v1767204465/anvil_gsz3tw.png" alt="Reef-Forge" style="max-width: 100px; height: auto; margin-bottom: 15px; opacity: 0.7;" />
      <p style="color: #999; font-size: 12px; margin: 0;">
        This email was sent to ${customerEmail}
      </p>
      <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
        © ${new Date().getFullYear()} Reef-Forge. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}
