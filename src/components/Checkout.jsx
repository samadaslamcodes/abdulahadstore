import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, LoaderCircle, MessageCircle, X } from 'lucide-react';
import { submitOrder } from '../lib/orderApi.js';

export default function Checkout({ items, onClose, onComplete }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const placeOrder = async (event) => {
    event.preventDefault();
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);
    setError('');

    try {
      const result = await submitOrder({
        ...form,
        items: items.map((item) => ({
          product_id: item.productId,
          name: item.name,
          size: item.size,
          qty: item.qty,
          price: item.price,
        })),
      });

      // Update state in App to show confirmation
      onComplete(result);

      // Redirect directly to WhatsApp (bypasses browser popup blockers on mobile & desktop)
      if (result.whatsapp_url) {
        setTimeout(() => {
          window.location.href = result.whatsapp_url;
        }, 150);
      }
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto bg-cream"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="mx-auto min-h-screen max-w-5xl px-4 py-5 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20"
            aria-label="Close checkout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-10 py-8 lg:grid-cols-[1fr_340px]">
          <form onSubmit={placeOrder}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60">
              Instant WhatsApp Checkout
            </p>
            <h1 className="mt-2 font-syne text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Checkout
            </h1>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/70">
                Full name
                <input
                  required
                  value={form.customer_name}
                  onChange={updateField('customer_name')}
                  placeholder="e.g. Samad Codes"
                  className="mt-2 w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                  autoComplete="name"
                />
              </label>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/70">
                Email
                <input
                  required
                  type="email"
                  value={form.customer_email}
                  onChange={updateField('customer_email')}
                  placeholder="e.g. samadcodes57@gmail.com"
                  className="mt-2 w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                  autoComplete="email"
                />
              </label>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/70">
                WhatsApp / Phone
                <input
                  required
                  type="tel"
                  value={form.customer_phone}
                  onChange={updateField('customer_phone')}
                  placeholder="e.g. 03258454946"
                  className="mt-2 w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                  autoComplete="tel"
                />
              </label>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/70">
                City
                <input
                  required
                  value={form.city}
                  onChange={updateField('city')}
                  placeholder="e.g. Karachi"
                  className="mt-2 w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                  autoComplete="address-level2"
                />
              </label>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/70 sm:col-span-2">
                Delivery address
                <textarea
                  required
                  value={form.address}
                  onChange={updateField('address')}
                  placeholder="Full street address, house/flat number, area"
                  className="mt-2 min-h-28 w-full resize-y border border-charcoal/20 bg-transparent px-4 py-3 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-charcoal"
                  autoComplete="street-address"
                />
              </label>
            </div>
            {error && (
              <p
                role="alert"
                className="mt-5 border border-accent/60 bg-accent/15 px-4 py-3 text-sm text-charcoal"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-charcoal px-6 py-4 text-xs uppercase tracking-widest font-semibold text-cream transition hover:bg-charcoal/85 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Placing Order...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 text-accent" /> Place Order (Send via WhatsApp)
                </>
              )}
            </button>
          </form>
          <aside className="h-fit bg-charcoal/5 p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60">
              Order summary
            </p>
            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-charcoal/60">
                      Size {item.size} × {item.qty}
                    </p>
                  </div>
                  <p className="font-medium">
                    PKR {(item.price * item.qty).toLocaleString('en-PK')}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-charcoal/10 pt-5 font-syne text-xl font-bold">
              <span>Total</span>
              <span>PKR {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-charcoal/60">
              <CheckCircle2 className="h-4 w-4 text-accent" /> Cash on delivery
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
