const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function submitOrder(order) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error ?? 'Unable to place the order.');
  return result;
}
