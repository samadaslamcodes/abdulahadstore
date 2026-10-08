import test from 'node:test';
import assert from 'node:assert/strict';

import { sendCustomerNotification, sendOrderNotifications, sendOwnerNotification } from './notifier.js';

const order = {
  order_number: 'ORD-1001',
  customer_name: 'Test Customer',
  customer_email: 'test@example.com',
  customer_phone: '+15550100',
  address: '1 Test Street',
  city: 'Lahore',
  items: [{ product_name: 'Shirt', size: 'M', qty: 1, price: 30 }],
  total_amount: 30,
  payment_method: 'Cash on Delivery',
  status: 'pending',
  created_at: '2026-10-07T12:00:00.000Z',
};

const env = {
  OWNER_EMAIL: 'owner@example.com',
  RESEND_FROM_EMAIL: 'onboarding@resend.dev',
  SEND_CUSTOMER_EMAIL: 'false',
};

function createResendClient(response) {
  return {
    emails: {
      send: async (payload) => response(payload),
    },
  };
}

test('owner alert is sent with the customer as reply-to, even in onboarding mode', async () => {
  let sentPayload;
  const client = createResendClient(async (payload) => {
    sentPayload = payload;
    return { data: { id: 'email_123' }, error: null };
  });
  const logs = [];
  const originalLog = console.log;
  console.log = (message) => logs.push(message);

  try {
    const result = await sendOwnerNotification(order, client, env);
    assert.equal(result.sent, true);
    assert.equal(result.id, 'email_123');
    assert.equal(sentPayload.from, 'onboarding@resend.dev');
    assert.equal(sentPayload.to, 'owner@example.com');
    assert.equal(sentPayload.reply_to, 'test@example.com');
    assert.equal(sentPayload.subject, 'New Order ORD-1001');
    assert.match(sentPayload.text, /Phone: \+15550100/);
    assert.match(sentPayload.text, /Time: 2026-10-07T12:00:00.000Z/);
    assert.deepEqual(logs, ['[notification] Owner email sent: email_123']);
  } finally {
    console.log = originalLog;
  }
});

test('owner failure logs the exact Resend error name and message', async () => {
  const client = createResendClient(async () => ({ data: null, error: { name: 'InvalidParameterError', message: 'Invalid sender email.' } }));
  const logs = [];
  const originalError = console.error;
  console.error = (message) => logs.push(message);

  try {
    const result = await sendOwnerNotification(order, client, env);
    assert.equal(result.sent, false);
    assert.equal(result.error.name, 'InvalidParameterError');
    assert.equal(result.error.message, 'Invalid sender email.');
    assert.deepEqual(logs, ['[notification] Owner email failed: InvalidParameterError: Invalid sender email.']);
  } finally {
    console.error = originalError;
  }
});

test('customer confirmation is silently skipped when disabled', async () => {
  const client = createResendClient(async () => {
    throw new Error('Customer email must not be attempted');
  });
  const result = await sendCustomerNotification(order, client, env);
  assert.deepEqual(result, { sent: false, skipped: true });
});

test('order notification always attempts the owner alert', async () => {
  const client = createResendClient(async () => ({ data: { id: 'email_456' }, error: null }));
  const results = await sendOrderNotifications(order, client, env);
  assert.equal(results[0].sent, true);
  assert.equal(results[1].skipped, true);
});
