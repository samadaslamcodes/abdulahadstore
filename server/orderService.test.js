import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrderNumber, formatCurrency, validateOrder, validateStatus } from './orderService.js';

test('validates required customer and delivery fields', () => {
  const result = validateOrder({ items: [{ product_id: 'henley-shirt', size: 'M', qty: 1 }] });
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ['address', 'city', 'customer_email', 'customer_name', 'customer_phone']);
});

test('resolves product details, size, quantity, and price from the server catalog', () => {
  const result = validateOrder({
    customer_name: 'Ayesha Khan', customer_email: 'a@example.com', customer_phone: '+1 555 0100',
    address: '1 Main Street', city: 'Lahore',
    items: [{ product_id: 'henley-shirt', size: 'M', qty: 2 }],
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.value.items, [{ product_name: 'Henley Shirts', size: 'M', qty: 2, price: 1500 }]);
  assert.equal(result.value.total_amount, 3000);
});

test('rejects unknown products and unsupported sizes', () => {
  const unknownProduct = validateOrder({
    customer_name: 'Ayesha Khan', customer_email: 'a@example.com', customer_phone: '+1 555 0100',
    address: '1 Main Street', city: 'Lahore', items: [{ product_id: 'missing', size: 'M', qty: 1 }],
  });
  const unsupportedSize = validateOrder({
    customer_name: 'Ayesha Khan', customer_email: 'a@example.com', customer_phone: '+1 555 0100',
    address: '1 Main Street', city: 'Lahore', items: [{ product_id: 'henley-shirt', size: 'XXL', qty: 1 }],
  });
  assert.equal(unknownProduct.valid, false);
  assert.equal(unsupportedSize.valid, false);
});

test('rejects unsafe item and status values', () => {
  assert.equal(validateStatus('delivered'), 'delivered');
  assert.equal(validateStatus('cancelled'), null);
  assert.equal(createOrderNumber(1001), 'ORD-1001');
  assert.equal(formatCurrency(13000), 'PKR 13000.00');
});
