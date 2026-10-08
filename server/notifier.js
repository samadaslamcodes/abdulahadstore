import 'dotenv/config';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function formatItems(items) {
  return items.map((item) => `- ${item.product_name} — Size ${item.size} × ${item.qty} — PKR ${Number(item.price).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`).join('\n');
}

function formatOrderEmail(order) {
  return `Order #${order.order_number}\nCustomer: ${order.customer_name}\nEmail: ${order.customer_email}\nPhone: ${order.customer_phone}\nAddress: ${order.address}, ${order.city}\nPayment: ${order.payment_method}\nStatus: ${order.status}\nTotal: PKR ${Number(order.total_amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nItems:\n${formatItems(order.items)}\n\nTime: ${new Date(order.created_at).toISOString()}`;
}

function formatCustomerEmail(order) {
  return `Thank you, ${order.customer_name}.\n\nYour order ${order.order_number} has been received.\n\nItems:\n${formatItems(order.items)}\n\nTotal: PKR ${Number(order.total_amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nDelivery: ${order.address}, ${order.city}\n\nWe will contact you shortly with further updates.`;
}

function normalizeError(error) {
  if (error instanceof Error) return { name: error.name, message: error.message };
  if (error && typeof error === 'object' && typeof error.name === 'string' && typeof error.message === 'string') {
    return { name: error.name, message: error.message };
  }
  return { name: 'UnknownError', message: String(error) };
}

async function sendEmail(resendClient, payload) {
  if (!resendClient) return { sent: false, error: { name: 'ResendConfigurationError', message: 'Resend is not configured.' } };

  try {
    const result = await resendClient.emails.send(payload);
    if (result.error) return { sent: false, error: normalizeError(result.error) };
    return { sent: true, error: null, id: result.data?.id ?? null };
  } catch (error) {
    return { sent: false, error: normalizeError(error) };
  }
}

export async function sendOwnerNotification(order, resendClient = resend, env = process.env) {
  if (!env.OWNER_EMAIL) return { sent: false, error: { name: 'ConfigurationError', message: 'OWNER_EMAIL is not configured.' } };
  if (!env.RESEND_FROM_EMAIL) return { sent: false, error: { name: 'ConfigurationError', message: 'RESEND_FROM_EMAIL is not configured.' } };

  const result = await sendEmail(resendClient, {
    from: env.RESEND_FROM_EMAIL,
    to: env.OWNER_EMAIL,
    reply_to: order.customer_email,
    subject: `New Order ${order.order_number}`,
    text: formatOrderEmail(order),
  });

  if (result.sent) console.log(`[notification] Owner email sent: ${result.id}`);
  else console.error(`[notification] Owner email failed: ${result.error.name}: ${result.error.message}`);
  return result;
}

export async function sendCustomerNotification(order, resendClient = resend, env = process.env) {
  if (env.SEND_CUSTOMER_EMAIL !== 'true') return { sent: false, skipped: true };
  if (!env.RESEND_FROM_EMAIL) return { sent: false, error: { name: 'ConfigurationError', message: 'RESEND_FROM_EMAIL is not configured.' } };

  return sendEmail(resendClient, {
    from: env.RESEND_FROM_EMAIL,
    to: order.customer_email,
    subject: `Your order ${order.order_number} is confirmed`,
    text: formatCustomerEmail(order),
  });
}

export async function sendOrderNotifications(order, resendClient = resend, env = process.env) {
  const ownerResult = await sendOwnerNotification(order, resendClient, env);
  const customerResult = await sendCustomerNotification(order, resendClient, env);
  return [ownerResult, customerResult];
}

export async function sendShipmentNotification(order, resendClient = resend, env = process.env) {
  if (!resendClient || !env.RESEND_FROM_EMAIL) {
    return { sent: false, error: { name: 'ResendConfigurationError', message: 'Resend is not configured.' } };
  }

  return sendEmail(resendClient, {
    from: env.RESEND_FROM_EMAIL,
    to: order.customer_email,
    subject: `Your order ${order.order_number} has been shipped.`,
    text: `Your order ${order.order_number} has been shipped.\n\nWe will update you when it is delivered.`,
  });
}
