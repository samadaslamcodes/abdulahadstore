import { getProductById } from '../src/data/products.js';

const PHONE_PATTERN = /^[+]?\d{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUS_VALUES = new Set(['pending', 'confirmed', 'shipped', 'delivered']);

export function validateOrder(payload) {
  const errors = {};
  const name = String(payload?.customer_name ?? '').trim();
  const email = String(payload?.customer_email ?? '').trim().toLowerCase();
  const phone = String(payload?.customer_phone ?? '').trim();
  const address = String(payload?.address ?? '').trim();
  const city = String(payload?.city ?? '').trim();
  const items = Array.isArray(payload?.items) ? payload.items : [];

  if (name.length < 2 || name.length > 100) errors.customer_name = 'Customer name must be between 2 and 100 characters.';
  if (!EMAIL_PATTERN.test(email)) errors.customer_email = 'Enter a valid email address.';
  if (!PHONE_PATTERN.test(phone.replace(/\s/g, ''))) errors.customer_phone = 'Enter a valid phone number.';
  if (address.length < 5 || address.length > 500) errors.address = 'Enter a valid delivery address.';
  if (city.length < 2 || city.length > 100) errors.city = 'Enter a valid city.';
  if (items.length === 0) errors.items = 'The order must contain at least one item.';

  const normalizedItems = [];
  for (const [index, item] of items.entries()) {
    const product = getProductById(String(item?.product_id ?? '').trim());
    const size = String(item?.size ?? '').trim().toUpperCase();
    const quantity = Number(item?.qty);
    if (!product) errors[`items.${index}.product_id`] = 'The selected product is unavailable.';
    if (!product?.sizes.includes(size)) errors[`items.${index}.size`] = 'The selected size is unavailable.';
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) errors[`items.${index}.qty`] = 'Item quantity must be a whole number between 1 and 100.';
    if (product && product.sizes.includes(size) && Number.isInteger(quantity) && quantity >= 1 && quantity <= 100) {
      normalizedItems.push({ product_name: product.name, size, qty: quantity, price: product.price });
    }
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  const totalAmount = Math.round(normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100;
  return {
    valid: true,
    value: {
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      address,
      city,
      items: normalizedItems,
      total_amount: totalAmount,
      payment_method: 'COD',
      status: 'pending',
    },
  };
}

export function validateStatus(status) {
  return STATUS_VALUES.has(status) ? status : null;
}

export function createOrderNumber(sequence) {
  return `ORD-${String(sequence).padStart(4, '0')}`;
}

export function formatCurrency(amount) {
  return `PKR ${Number(amount).toFixed(2)}`;
}
