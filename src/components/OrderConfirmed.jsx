import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function OrderConfirmed({ orderNumber, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Order confirmed">
      <div className="w-full max-w-md bg-cream p-8 text-center shadow-2xl sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-charcoal/60">Order confirmed</p>
        <h2 className="mt-2 font-syne text-3xl font-bold uppercase tracking-tight">Thank you!</h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/65">Your order has been received. We will contact you shortly with further updates.</p>
        <div className="mt-7 border border-charcoal/15 bg-charcoal/5 px-5 py-4"><p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/55">Order number</p><p className="mt-1 font-syne text-xl font-bold tracking-wide">{orderNumber}</p></div>
        <button type="button" onClick={onClose} className="mt-7 w-full bg-charcoal px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-cream transition hover:bg-charcoal/85">Continue shopping</button>
        <button type="button" onClick={onClose} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-charcoal" aria-label="Close confirmation"><X className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
