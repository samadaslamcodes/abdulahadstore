import React from 'react';
import { products } from '../data/products.js';

/**
 * CategoryStrip Component
 * Minimalist product showcase with hover/tap effects.
 * Optimized for mobile touch experience and responsive screens.
 */
export default function CategoryStrip({ onSelectProduct }) {
  return (
    <section 
      id="categories"
      aria-label="Upcoming Categories"
      className="py-12 sm:py-24 border-t border-charcoal/10 bg-cream scroll-mt-16"
    >
      {/* Anchor for Shop link */}
      <div id="shop" className="-top-20 relative"></div>
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-charcoal/60">
              Drop 001
            </span>
            <h2 className="font-syne text-2xl sm:text-4xl font-bold uppercase tracking-tight text-charcoal mt-1">
              Curated Silhouette
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-sm mt-2 sm:mt-0 font-normal">
            Each garment is precision-engineered for modern drape, longevity, and tactile comfort.
          </p>
        </div>

        {/* 3 Minimal Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="group flex flex-col bg-cream/60 border border-charcoal/15 transition-all duration-300 hover:border-charcoal/50 hover:shadow-md active:scale-[0.99] max-w-md mx-auto sm:max-w-none w-full"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/5">
                <img
                  src={product.image}
                  alt={`${product.name} - ADAAB OFFICIAL`}
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Subtle Sand Tone Overlay */}
                <div className="absolute inset-0 bg-accent/10 opacity-70 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>

                {/* Product Code */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
                  <span className="inline-block bg-cream/90 backdrop-blur-sm text-charcoal text-[9px] uppercase tracking-wider font-semibold py-1 px-2 border border-charcoal/10">
                    CAT 0{index + 1}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between border-t border-charcoal/10">
                <div>
                  <h3 className="font-syne text-base sm:text-lg font-bold uppercase tracking-wider text-charcoal group-hover:text-charcoal transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1.5 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between gap-3 text-[10px] sm:text-[11px] uppercase tracking-widest text-charcoal/70">
                  <span>First Drop Edition</span>
                  <button type="button" onClick={() => onSelectProduct(product)} className="bg-charcoal px-4 py-2 text-cream text-[10px] font-semibold transition hover:bg-charcoal/85 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal">Order Now</button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
