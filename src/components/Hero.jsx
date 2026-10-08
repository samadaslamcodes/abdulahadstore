import React from 'react';
import { Bell } from 'lucide-react';
import { InstagramIcon } from './SocialIcons.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { heroImage } from '../assets/images.js';

// Launch date constant — adjust anytime to update the countdown
export const LAUNCH_DATE = "2026-12-01T00:00:00";

/**
 * Hero Component
 * Displays the official ADAAB campaign banner cleanly without clutter,
 * optimized for seamless viewing on both mobile phones and desktop displays.
 */
export default function Hero() {
  const scrollToSignup = (e) => {
    e.preventDefault();
    const signupSection = document.getElementById('email-signup');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
      const input = signupSection.querySelector('input[type="email"]');
      if (input) {
        setTimeout(() => input.focus(), 600);
      }
    }
  };

  return (
    <section 
      id="hero"
      aria-label="Official ADAAB Banner"
      className="relative pt-2 sm:pt-6 pb-10 sm:pb-16 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* Official ADAAB Campaign Banner Showcase */}
      <div className="w-full max-w-lg md:max-w-2xl mx-auto shadow-xl sm:shadow-2xl border border-charcoal/20 bg-charcoal/5 overflow-hidden transition-all duration-300">
        <img
          src={heroImage}
          alt="ADAAB Official Brand Campaign — Premium Henley Tee"
          className="w-full h-auto object-contain block select-none"
          loading="eager"
        />
      </div>

      {/* Clean Launch Countdown & Direct Actions */}
      <div className="w-full max-w-lg sm:max-w-xl mt-6 sm:mt-8 flex flex-col items-center text-center">
        {/* Responsive Countdown Component */}
        <CountdownTimer targetDate={LAUNCH_DATE} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full mt-3 sm:mt-4 px-1 sm:px-0">
          <a
            href="#email-signup"
            onClick={scrollToSignup}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 bg-charcoal text-cream text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/85 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
          >
            <Bell className="w-4 h-4 text-accent shrink-0" />
            <span>Notify Me (VIP Access)</span>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 bg-transparent border border-charcoal text-charcoal text-xs uppercase tracking-widest font-semibold hover:bg-charcoal hover:text-cream active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
          >
            <InstagramIcon className="w-4 h-4 shrink-0" />
            <span>Follow on Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
}

