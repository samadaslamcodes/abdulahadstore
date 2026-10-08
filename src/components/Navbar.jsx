import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from './SocialIcons.jsx';

/**
 * Navbar Component
 * Features dynamic scroll transparency/solid transition, responsive desktop navigation,
 * and high-end mobile off-canvas drawer with touch optimizations.
 */
export default function Navbar({ cartCount, onOpenCart }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', soon: false },
    { name: 'Shop', href: '#categories', soon: true },
    { name: 'Collections', href: '#categories', soon: true },
    { name: 'About', href: '#statement', soon: true },
    { name: 'Contact', href: '#footer', soon: false },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-charcoal/10 py-3 sm:py-3.5'
            : 'bg-transparent py-3.5 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Wordmark */}
            <div className="flex items-center">
              <a
                href="#"
                className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                aria-label="ADAAB OFFICIAL Home"
              >
                <span className="font-syne text-lg sm:text-2xl font-extrabold tracking-[0.22em] text-charcoal uppercase leading-none">
                  ADAAB
                </span>
                <span className="font-inter text-[8px] sm:text-[9px] tracking-[0.38em] text-charcoal/70 uppercase mt-0.5">
                  OFFICIAL
                </span>
              </a>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav 
              aria-label="Main Navigation" 
              className="hidden md:flex items-center space-x-7 lg:space-x-9"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group relative inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-charcoal/80 hover:text-charcoal transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-charcoal"
                >
                  <span>{link.name}</span>
                  {link.soon && (
                    <span className="text-[9px] font-semibold bg-accent/40 text-charcoal px-1.5 py-0.5 rounded-[2px] tracking-normal border border-accent/60">
                      Soon
                    </span>
                  )}
                  {/* Subtle underline hover effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-charcoal transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Right: Action Icons (Search, User, ShoppingBag) & Mobile Menu Toggle */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                type="button"
                aria-label="Search items"
                title="Search (Coming soon)"
                className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-charcoal hover:text-charcoal/60 active:scale-95 transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                onClick={() => alert("Search functionality will be unlocked at official launch.")}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </button>

              <button
                type="button"
                aria-label="Account Login"
                title="Account (Coming soon)"
                className="hidden xs:flex p-2 min-w-[38px] min-h-[38px] items-center justify-center text-charcoal hover:text-charcoal/60 active:scale-95 transition-all rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                onClick={() => alert("Customer accounts will be available on launch day.")}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </button>

              <button
                type="button"
                aria-label="Shopping Bag"
                title="Open shopping cart"
                className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-charcoal hover:text-charcoal/60 active:scale-95 transition-all relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                onClick={onOpenCart}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                {cartCount > 0 && <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[8px] font-bold text-charcoal">{cartCount}</span>}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 min-w-[42px] min-h-[42px] flex items-center justify-center text-charcoal hover:text-charcoal/70 active:scale-90 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal ml-1"
                aria-expanded={mobileMenuOpen}
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Content */}
        <aside
          aria-label="Mobile Navigation Drawer"
          className={`absolute top-0 right-0 h-full w-[85%] max-w-xs sm:max-w-sm bg-cream border-l border-charcoal/15 shadow-2xl p-5 sm:p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-5 border-b border-charcoal/10">
              <div className="flex flex-col">
                <span className="font-syne text-lg font-bold tracking-[0.2em] text-charcoal">
                  ADAAB
                </span>
                <span className="text-[8px] uppercase tracking-[0.35em] text-charcoal/60">
                  OFFICIAL
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-charcoal/5 active:scale-95 text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="mt-6 flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs sm:text-sm uppercase tracking-widest font-semibold text-charcoal hover:text-accent transition-colors py-3.5 px-2 border-b border-charcoal/5 active:bg-charcoal/5 rounded-sm"
                >
                  <span>{link.name}</span>
                  {link.soon ? (
                    <span className="text-[9px] font-semibold bg-accent/40 text-charcoal px-2 py-0.5 rounded tracking-normal">
                      Soon
                    </span>
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-charcoal/40" />
                  )}
                </a>
              ))}
            </nav>

            {/* Quick Notify CTA in Mobile Drawer */}
            <div className="mt-8">
              <a
                href="#email-signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-charcoal text-cream text-[11px] uppercase tracking-widest font-semibold hover:bg-charcoal/90 active:scale-98 transition-all"
              >
                <span>Get Early Drop Access</span>
                <ArrowRight className="w-3 h-3 text-accent" />
              </a>
            </div>
          </div>

          {/* Drawer Footer with Social Channels & Monogram */}
          <div className="pt-6 mt-6 border-t border-charcoal/10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 font-medium mb-3">
              Connect With Us
            </p>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-charcoal/20 rounded-full text-charcoal hover:border-charcoal transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 border border-charcoal/20 rounded-full text-charcoal hover:border-charcoal transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/923258454946"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2 border border-charcoal/20 rounded-full text-charcoal hover:border-charcoal transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[10px] text-charcoal/60">
              © 2026 ADAAB OFFICIAL. Crafted for the modern man.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

