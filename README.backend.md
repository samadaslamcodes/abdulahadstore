# ADAAB Order Backend

## Local setup

1. Copy `.env.example` to `.env` and fill every required value.
2. Run the Supabase SQL in `server/supabase-schema.sql`.
3. Install dependencies with `npm install`.
4. Start the application with `npm run dev`.
5. Open `http://localhost:3001`.

The development command starts the Vite frontend and Express API together. In production, run `npm run build` then `npm start`; the Express process serves the built frontend.

## Environment variables

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key from Supabase; never expose it in browser code.
- `RESEND_API_KEY`: Resend API key.
- `RESEND_FROM_EMAIL`: verified sender address.
- `OWNER_EMAIL`: owner notification destination.
- `ADMIN_PASSWORD`: server-side admin password.
- `PORT`: API/frontend port, default `3001`.

## End-to-end test

1. Create a fake order through `POST /api/orders` with customer details, address, city, and two items.
2. Verify the response contains an `order_number` and `status: pending`.
3. Confirm the order appears in Supabase and in `/admin`.
4. Verify the owner email and customer email arrive.
5. Change the status to `shipped` in the admin page and verify the customer receives the shipment email.
6. Confirm a browser request cannot list orders without the admin password.

## Notifications are independent

The order is saved before notifications run. If either Resend email fails, the API logs the failure and still returns a successful order response. Notification failures do not roll back the order. If Resend is not configured, the API skips both emails and logs one short warning.
