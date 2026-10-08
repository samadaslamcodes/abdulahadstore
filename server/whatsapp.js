import dotenv from 'dotenv';
dotenv.config();

/**
 * Format order into the exact required WhatsApp message layout:
 * New Order 🛒
 * Order ID: <unique id>
 * Name: <customer name>
 * Phone: <customer phone>
 * Address: <address>
 * Items: <item x quantity – price>
 * Total: <total amount>
 * Time: <date and time>
 */
export function formatOrderMessage(order) {
  const {
    orderId,
    customer_name,
    customer_phone,
    address,
    city,
    items = [],
    total,
    timestamp,
  } = order;

  const fullAddress = city ? `${address}, ${city}` : address;
  const formattedItems = items
    .map((item) => {
      const sizeTag = item.size ? ` (Size ${item.size})` : '';
      const priceTag = item.price
        ? ` – PKR ${(item.price * (item.qty || 1)).toLocaleString('en-PK')}`
        : '';
      return `• ${item.name}${sizeTag} x ${item.qty || 1}${priceTag}`;
    })
    .join('\n');

  const formattedTotal =
    typeof total === 'number'
      ? `PKR ${total.toLocaleString('en-PK')}`
      : total || 'N/A';

  const orderTime =
    timestamp ||
    new Date().toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return `New Order 🛒
Order ID: ${orderId}
Name: ${customer_name}
Phone: ${customer_phone}
Address: ${fullAddress}
Items:
${formattedItems}
Total: ${formattedTotal}
Time: ${orderTime}`;
}

/**
 * Generates direct wa.me link with prefilled order text
 */
export function generateWhatsAppUrl(order, phone) {
  const targetPhone = (phone || process.env.WHATSAPP_PHONE || '923232788145').replace(/\D/g, '');
  const message = formatOrderMessage(order);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Dispatches WhatsApp message using CallMeBot, Twilio, or console logger.
 */
export async function sendWhatsAppNotification(order) {
  const message = formatOrderMessage(order);
  const targetPhone = (process.env.WHATSAPP_PHONE || '923232788145').replace(/\D/g, '');
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;

  console.log('\n=================== NEW ORDER RECEIVED ===================');
  console.log(message);
  console.log('==========================================================\n');

  // Option A: Twilio WhatsApp API
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  ) {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const params = new URLSearchParams();
      params.append('From', `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`);
      params.append('To', `whatsapp:+${targetPhone}`);
      params.append('Body', message);

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (response.ok) {
        return { success: true, provider: 'twilio' };
      }
    } catch (err) {
      console.warn('Twilio delivery attempt failed:', err.message);
    }
  }

  // Option B: CallMeBot Free WhatsApp API
  if (callMeBotKey && callMeBotKey.trim()) {
    try {
      const encodedText = encodeURIComponent(message);
      const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodedText}&apikey=${callMeBotKey.trim()}`;

      const response = await fetch(callMeBotUrl);
      const resultText = await response.text();

      if (response.ok && !resultText.toLowerCase().includes('error')) {
        console.log('✅ CallMeBot sent message successfully to WhatsApp!');
        return { success: true, provider: 'callmebot' };
      } else {
        console.warn('CallMeBot response:', resultText);
      }
    } catch (err) {
      console.warn('CallMeBot delivery attempt failed:', err.message);
    }
  }

  return { success: true, provider: 'direct_whatsapp' };
}
