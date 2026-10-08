import express from 'express';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import 'dotenv/config';
import { createOrder, getNextOrderNumber, listOrders, updateOrderStatus } from './supabase.js';
import { createOrderNumber, validateOrder, validateStatus } from './orderService.js';
import { sendOrderNotifications, sendShipmentNotification } from './notifier.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.ADMIN_PASSWORD ?? 'development-only-session-secret-change-me';

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => {
    const [name, ...value] = part.trim().split('=');
    if (!name) return null;
    return [name, decodeURIComponent(value.join('='))];
  }).filter(Boolean));
}

app.use((req, _res, next) => {
  req.cookies = parseCookies(req.headers.cookie ?? '');
  next();
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many order attempts. Please try again later.' },
});

function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ expiresAt: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifySessionToken(token) {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(signatureBuffer, expectedBuffer)
    && JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).expiresAt > Date.now();
}

function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_session;
  if (!token || !verifySessionToken(token)) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
  next();
}

function adminPage() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ADAAB Orders</title><style>body{margin:0;min-height:100vh;background:#f5f3ee;color:#111;font-family:Inter,Arial,sans-serif}.shell{max-width:960px;margin:auto;padding:32px 20px}.brand{font:800 24px Syne,Arial,sans-serif;letter-spacing:.2em}h1{font:700 36px Syne,Arial,sans-serif}table{width:100%;border-collapse:collapse};th,td{padding:12px;border-bottom:1px solid #ddd;text-align:left}select{padding:8px;border:1px solid #111;background:#fff}.login{max-width:420px;margin:80px auto;padding:32px;background:#111;color:#fff}.login input{width:100%;box-sizing:border-box;padding:12px;margin:16px 0}.login button{width:100%;padding:12px;border:0;background:#c9b79c;color:#111;font-weight:700}</style></head><body><main class="shell"><div class="brand">ADAAB OFFICIAL</div><h1>Orders</h1><table><thead><tr><th>Order</th><th>Customer</th><th>Email</th><th>Total</th><th>Payment</th><th>Status</th><th>Created</th></tr></thead><tbody id="orders"></tbody></table></main><script>let orders=[];async function load(){const response=await fetch('/api/admin/orders');if(!response.ok){location.href='/admin';return}orders=await response.json();render()}function render(){document.querySelector('#orders').innerHTML=orders.map(o=>('<tr><td><strong>'+escapeHtml(o.order_number)+'</strong></td><td>'+escapeHtml(o.customer_name)+'</td><td>'+escapeHtml(o.customer_email)+'</td><td>$'+Number(o.total_amount).toFixed(2)+'</td><td>'+escapeHtml(o.payment_method)+'</td><td><select data-id="'+o.id+'"><option value="pending" '+(o.status==='pending'?'selected':'')+'>Pending</option><option value="confirmed" '+(o.status==='confirmed'?'selected':'')+'>Confirmed</option><option value="shipped" '+(o.status==='shipped'?'selected':'')+'>Shipped</option><option value="delivered" '+(o.status==='delivered'?'selected':'')+'>Delivered</option></select></td><td>'+new Date(o.created_at).toLocaleString()+'</td></tr>')).join('')}function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}document.addEventListener('change',async event=>{if(!event.target.matches('select[data-id]'))return;const response=await fetch('/api/admin/orders/'+event.target.dataset.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:event.target.value})});if(response.ok)load();});load()</script></body></html>`;
}

app.get('/admin', (req, res) => {
  if (req.cookies?.admin_session && verifySessionToken(req.cookies.admin_session)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(adminPage());
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(401).send('<!doctype html><html><head><meta charset="utf-8"><title>ADAAB Admin</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#111;color:#f5f3ee;font-family:Arial}.login{width:min(420px,90%);padding:32px;background:#f5f3ee;color:#111}.login input{width:100%;box-sizing:border-box;padding:12px;margin:16px 0}.login button{width:100%;padding:12px;border:0;background:#c9b79c;font-weight:700}</style></head><body><form class="login" method="post" action="/admin"><h1>Admin Login</h1><p>Enter the configured admin password.</p><input type="password" name="password" autocomplete="current-password" required><button type="submit">Sign in</button></form></body></html>');
});

app.post('/admin', (req, res) => {
  const password = String(req.body?.password ?? '');
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).send('Invalid password.');
  const token = createSessionToken();
  res.cookie('admin_session', token, { httpOnly: true, sameSite: 'lax', secure: isProduction, maxAge: 8 * 60 * 60 * 1000 });
  res.redirect('/admin');
});

app.post('/api/orders', orderLimiter, async (req, res) => {
  const validation = validateOrder(req.body);
  if (!validation.valid) return res.status(400).json({ error: 'Invalid order data.', fields: validation.errors });

  let sequence;
  try {
    sequence = await getNextOrderNumber();
  } catch (error) {
    console.error('[order] Order number allocation failed:', error.message);
    return res.status(500).json({ error: 'Unable to allocate an order number.' });
  }

  const order = { ...validation.value, order_number: createOrderNumber(sequence) };
  try {
    const saved = await createOrder(order);
    await sendOrderNotifications(saved);
    return res.status(201).json({ order_number: saved.order_number, status: saved.status, message: 'Order confirmed.' });
  } catch (error) {
    console.error('[order] Supabase persistence failed:', error.message);
    return res.status(500).json({ error: 'The order could not be saved. Please try again.' });
  }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await listOrders();
    return res.json(orders);
  } catch (error) {
    console.error('[admin] Order listing failed:', error.message);
    return res.status(500).json({ error: 'Unable to load orders.' });
  }
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const status = validateStatus(req.body?.status);
  if (!status) return res.status(400).json({ error: 'Invalid order status.' });
  try {
    const updated = await updateOrderStatus(req.params.id, status);
    if (status === 'shipped') await sendShipmentNotification(updated);
    return res.json(updated);
  } catch (error) {
    console.error('[admin] Order status update failed:', error.message);
    return res.status(500).json({ error: 'Unable to update order.' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'adaab-orders' }));

if (!isProduction) {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
  app.use(/.*/, async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
} else {
  app.use(express.static('dist'));
  app.get('/*splat', (_req, res) => res.sendFile('index.html', { root: 'dist' }));
}

app.listen(port, () => console.log(`ADAAB order API listening on http://localhost:${port}`));
