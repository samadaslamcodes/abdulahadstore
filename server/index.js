import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { sendWhatsAppNotification, generateWhatsAppUrl } from './whatsapp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Anti-spam Rate Limiter: max 30 order submissions per 15 minutes per IP
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment before trying again.',
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ADAAB WhatsApp Order Server', time: new Date().toISOString() });
});

// Order handler function
const handleOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      address,
      city = '',
      items = [],
      customer_email = '',
    } = req.body;

    // 1. Validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!customer_phone || !customer_phone.trim()) {
      return res.status(400).json({ error: 'Please enter your phone number.' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ error: 'Please enter your delivery address.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty. Please add items to place an order.' });
    }

    // 2. Calculate Total
    const calculatedTotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
      0
    );

    // 3. Generate Clean Unique Order ID (e.g. ADB-739201)
    const orderId = `ADB-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email.trim(),
      address: address.trim(),
      city: city.trim(),
      items,
      total: calculatedTotal,
      timestamp: new Date().toLocaleString('en-PK', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    // 4. Send background WhatsApp notification (if CallMeBot/Twilio is configured)
    await sendWhatsAppNotification(orderPayload);

    // 5. Generate instant WhatsApp direct URL
    const whatsappUrl = generateWhatsAppUrl(orderPayload, process.env.WHATSAPP_PHONE);

    // 6. Respond back to frontend
    return res.status(200).json({
      success: true,
      order_number: orderId,
      whatsapp_url: whatsappUrl,
      order: orderPayload,
      message: 'Order received successfully.',
    });
  } catch (error) {
    console.error('❌ Order Processing Error:', error);
    return res.status(500).json({
      error: 'Unable to process order. Please contact us on WhatsApp directly.',
    });
  }
};

// Route definitions for both /api/order and /api/orders
app.post('/api/order', orderLimiter, handleOrder);
app.post('/api/orders', orderLimiter, handleOrder);

app.listen(PORT, () => {
  console.log(`🚀 ADAAB WhatsApp Order Backend running on http://localhost:${PORT}`);
  console.log(`📱 Destination WhatsApp: ${process.env.WHATSAPP_PHONE || '923258454946'}`);
});
