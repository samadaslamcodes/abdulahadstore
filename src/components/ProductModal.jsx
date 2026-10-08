import React, { useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const addItem = () => {
    onAddToCart(product, size, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-charcoal/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${product.name} product details`} onMouseDown={onClose}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-cream shadow-2xl sm:flex sm:rounded-sm" onMouseDown={(event) => event.stopPropagation()}>
        <div className="relative min-h-[280px] bg-charcoal/5 sm:w-1/2 sm:min-h-[620px]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <button type="button" onClick={onClose} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-charcoal shadow-sm transition hover:bg-cream" aria-label="Close product details"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-col justify-between p-6 sm:p-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60">First Drop Edition</p>
            <h2 className="mt-2 font-syne text-3xl font-bold uppercase tracking-tight text-charcoal sm:text-4xl">{product.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{product.description}</p>
            <p className="mt-5 font-syne text-xl font-bold text-charcoal">PKR {product.price.toLocaleString('en-PK')}</p>
            <div className="mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">Select size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button key={option} type="button" onClick={() => setSize(option)} className={`min-w-12 border px-3 py-2.5 text-xs font-semibold transition ${size === option ? 'border-charcoal bg-charcoal text-cream' : 'border-charcoal/25 text-charcoal hover:border-charcoal'}`} aria-pressed={size === option}>{option}</button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">Quantity</p>
              <div className="mt-3 flex items-center gap-3">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center border border-charcoal/25" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                <span className="min-w-5 text-center text-sm font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => Math.min(10, value + 1))} className="flex h-10 w-10 items-center justify-center border border-charcoal/25" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          <button type="button" onClick={addItem} className="mt-8 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-charcoal text-cream text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/85 active:scale-[0.99] transition-all"><Check className="h-4 w-4" /> Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
