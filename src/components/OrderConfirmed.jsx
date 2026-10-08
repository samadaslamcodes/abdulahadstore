import React from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';

export default function OrderConfirmed({ orderData, onClose }) {
  const orderNumber = typeof orderData === 'object' ? orderData?.order_number : orderData;
  const whatsappUrl = typeof orderData === 'object' ? orderData?.whatsapp_url : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Order confirmed"
    >
      <div className="relative w-full max-w-md bg-cream p-8 text-center shadow-2xl sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-charcoal/60">
          Order Confirmed
        </p>
        <h2 className="mt-2 font-syne text-3xl font-bold uppercase tracking-tight">
          Thank you!
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/65">
          Your order has been received. We have generated your WhatsApp order confirmation.
        </p>

        <div className="mt-6 border border-charcoal/15 bg-charcoal/5 px-5 py-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/55">
            Order Number
          </p>
          <p className="mt-1 font-syne text-xl font-bold tracking-wide">
            {orderNumber}
          </p>
        </div>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 bg-[#25D366] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition hover:bg-[#1EBE5D]"
          >
            <MessageCircle className="h-5 w-5" /> Open in WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-cream transition hover:bg-charcoal/85"
        >
          Continue Shopping
        </button>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-charcoal hover:bg-charcoal/10"
          aria-label="Close confirmation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
