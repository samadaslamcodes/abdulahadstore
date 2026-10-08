import React from 'react';

/**
 * BrandStatement Component
 * Editorial brand manifesto segment with balanced whitespace and bold typography,
 * optimized for seamless mobile reading.
 */
export default function BrandStatement() {
  return (
    <section 
      id="statement"
      aria-label="Brand Philosophy"
      className="py-16 sm:py-28 bg-cream border-t border-charcoal/10 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Brand Tag */}
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold text-charcoal/50 mb-4 sm:mb-6 inline-block">
          The ADAAB Philosophy
        </span>

        {/* The Bold One-Liner Statement */}
        <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wide text-charcoal leading-tight">
          Minimal. Sharp. <br className="inline" />
          <span className="text-charcoal/90">Made to be worn daily.</span>
        </h2>

        {/* Editorial Subtext */}
        <p className="mt-5 sm:mt-8 text-xs sm:text-sm md:text-base text-charcoal/70 max-w-xl mx-auto leading-relaxed font-normal">
          Designed without excess. ADAAB OFFICIAL represents a disciplined return to proportion, texture, and uncompromising construction.
        </p>

        {/* Accent Divider */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-3">
          <span className="w-8 sm:w-12 h-px bg-charcoal/20"></span>
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-accent"></span>
          <span className="w-8 sm:w-12 h-px bg-charcoal/20"></span>
        </div>
      </div>
    </section>
  );
}

