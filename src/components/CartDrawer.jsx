import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

export default function CartDrawer({ items, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-[80] bg-charcoal/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Shopping cart" onMouseDown={onClose}>
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-cream shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-5">
          <div><p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60">Your selection</p><h2 className="mt-1 font-syne text-2xl font-bold uppercase tracking-tight">Cart</h2></div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20" aria-label="Close cart"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center text-center"><ShoppingBag className="h-10 w-10 text-charcoal/25" /><p className="mt-4 font-syne text-xl font-bold uppercase">Your cart is empty</p><p className="mt-2 text-sm text-charcoal/60">Choose a product and select your size.</p></div>
          ) : (
            <div className="space-y-4">{items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4 border-b border-charcoal/10 pb-4">
                <img src={item.image} alt={item.name} className="h-28 w-24 object-cover" />
                <div className="flex min-w-0 flex-1 flex-col"><div className="flex justify-between gap-2"><div><h3 className="font-syne text-sm font-bold uppercase tracking-wide">{item.name}</h3><p className="mt-1 text-xs text-charcoal/60">Size {item.size}</p></div><button type="button" onClick={() => onRemove(item.productId, item.size)} className="text-charcoal/45 hover:text-charcoal" aria-label={`Remove ${item.name}`}><Trash2 className="h-4 w-4" /></button></div><div className="mt-auto flex items-center justify-between"><div className="flex items-center border border-charcoal/20"><button type="button" onClick={() => onUpdateQuantity(item.productId, item.size, item.qty - 1)} className="flex h-8 w-8 items-center justify-center" aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button><span className="w-7 text-center text-xs font-semibold">{item.qty}</span><button type="button" onClick={() => onUpdateQuantity(item.productId, item.size, item.qty + 1)} className="flex h-8 w-8 items-center justify-center" aria-label="Increase quantity"><Plus className="h-3 w-3" /></button></div><p className="text-sm font-semibold">PKR {(item.price * item.qty).toLocaleString('en-PK')}</p></div></div>
              </div>
            ))}</div>
          )}
        </div>
        {items.length > 0 && <div className="border-t border-charcoal/10 bg-cream/95 p-5"><div className="mb-4 flex items-center justify-between"><span className="text-xs uppercase tracking-widest text-charcoal/60">Subtotal</span><span className="font-syne text-xl font-bold">PKR {subtotal.toLocaleString('en-PK')}</span></div><button type="button" onClick={onCheckout} className="w-full bg-charcoal px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-cream transition hover:bg-charcoal/85 active:scale-[0.99]">Checkout</button></div>}
      </aside>
    </div>
  );
}
