/**
 * Frontend Order Processor & WhatsApp Dispatcher
 * 100% Standalone: Works seamlessly on Netlify, Vercel, and GitHub Pages with ZERO backend server needed.
 */
export const STORE_WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE || '923258454946';

/**
 * Format order into the exact WhatsApp layout
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
      const sizeTag = item.size ? ` (Size: ${item.size})` : '';
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
 * Submits the order client-side, saves to localStorage, and creates the WhatsApp link
 */
export async function submitOrder(orderData) {
  const {
    customer_name,
    customer_phone,
    address,
    city = '',
    items = [],
    customer_email = '',
  } = orderData;

  // Validation
  if (!customer_name || !customer_name.trim()) {
    throw new Error('Please enter your full name.');
  }
  if (!customer_phone || !customer_phone.trim()) {
    throw new Error('Please enter your WhatsApp/phone number.');
  }
  if (!address || !address.trim()) {
    throw new Error('Please enter your delivery address.');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Your cart is empty. Please add items to place an order.');
  }

  // Calculate total amount
  const calculatedTotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  // Generate Unique Order ID (e.g. ADB-592813)
  const orderId = `ADB-${Math.floor(100000 + Math.random() * 900000)}`;

  const fullOrder = {
    orderId,
    customer_name: customer_name.trim(),
    customer_phone: customer_phone.trim(),
    customer_email: customer_email.trim(),
    address: address.trim(),
    city: city.trim(),
    items,
    total: calculatedTotal,
    timestamp: new Date().toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };

  const messageText = formatOrderMessage(fullOrder);
  const cleanPhone = STORE_WHATSAPP_PHONE.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  // Save order to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('adaab_orders') || '[]');
    existing.unshift(fullOrder);
    localStorage.setItem('adaab_orders', JSON.stringify(existing));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }

  // Slight delay for smooth loading state
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    success: true,
    order_number: orderId,
    whatsapp_url: whatsappUrl,
    order: fullOrder,
    messageText,
  };
}
