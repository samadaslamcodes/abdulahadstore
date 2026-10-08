import React from 'react';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from './SocialIcons.jsx';

/**
 * Footer Component
 * Brand mark, social channels, concierge contact line, and legal copyright.
 * Optimized for mobile touch accessibility.
 */
export default function Footer() {
  return (
    <footer 
      id="footer"
      aria-label="Footer"
      className="bg-charcoal text-cream pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-charcoal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 sm:pb-12 border-b border-cream/10">
          
          {/* Brand Wordmark & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-syne text-xl sm:text-2xl font-extrabold tracking-[0.25em] text-cream uppercase leading-none">
              ADAAB
            </span>
            <span className="font-inter text-[9px] sm:text-[10px] tracking-[0.4em] text-cream/70 uppercase mt-1">
              OFFICIAL
            </span>
            <p className="text-xs text-cream/50 mt-2 sm:mt-3 max-w-xs">
              Modern streetwear crafted with architectural precision and timeless minimalism.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ADAAB OFFICIAL on Instagram"
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-cream/20 text-cream/80 hover:text-cream hover:border-cream active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ADAAB OFFICIAL on Facebook"
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-cream/20 text-cream/80 hover:text-cream hover:border-cream active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>

            <a
              href="https://wa.me/923258454946"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ADAAB OFFICIAL on WhatsApp"
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-cream/20 text-cream/80 hover:text-cream hover:border-cream active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Contact Line */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <span className="text-[10px] uppercase tracking-[0.25em] text-cream/50 font-semibold mb-1">
              Direct Contact
            </span>
            <a 
              href="mailto:contact@adaabofficial.com"
              className="text-xs text-accent hover:text-cream active:text-white transition-colors tracking-wide py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              contact@adaabofficial.com
            </a>
            <span className="text-[10px] sm:text-[11px] text-cream/40 mt-0.5">
              Press & Retail: info@adaabofficial.com
            </span>
          </div>
        </div>

        {/* Bottom Legal / Copyright Strip */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-3 sm:gap-4 text-center">
          <p className="tracking-wider text-[11px] sm:text-xs">
            © 2026 ADAAB OFFICIAL. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] tracking-widest uppercase">
            <a href="#hero" className="hover:text-cream transition-colors py-1">Privacy</a>
            <span>•</span>
            <a href="#hero" className="hover:text-cream transition-colors py-1">Terms</a>
            <span>•</span>
            <a href="#hero" className="hover:text-cream transition-colors py-1">Top ↑</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

