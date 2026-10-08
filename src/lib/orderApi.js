/**
 * Client-Side Order API
 * Sends checkout orders to backend POST /api/order
 */
export async function submitOrder(order) {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(order),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || 'Unable to place your order. Please check your details or contact us on WhatsApp.'
    );
  }

  // Save client order backup in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('adaab_orders') || '[]');
    existing.unshift({
      ...order,
      order_number: data.order_number,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('adaab_orders', JSON.stringify(existing));
  } catch (err) {
    // Silent fail for storage quotas
  }

  return data;
}
