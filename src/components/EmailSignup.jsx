import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Destination email where VIP subscriber notifications are routed
const RECIPIENT_EMAIL = "samadcodes57@gmail.com";

/**
 * EmailSignup Component
 * Collects emails for early access notification with client-side validation
 * and routes responses directly to samadcodes57@gmail.com via FormSubmit AJAX.
 */
export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email regex validation rule
  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(input).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save subscriber locally for backup
      const currentList = JSON.parse(localStorage.getItem('adaab_subscribers') || '[]');
      currentList.push({ email: trimmedEmail, date: new Date().toISOString() });
      localStorage.setItem('adaab_subscribers', JSON.stringify(currentList));

      // 2. Dispatch email notification directly to samadcodes57@gmail.com
      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Subscriber_Email: trimmedEmail,
          _subject: `New VIP Early Access Subscriber: ${trimmedEmail} (ADAAB OFFICIAL)`,
          Brand: "ADAAB OFFICIAL",
          Source: "Coming Soon Landing Page - VIP Early Access Form",
          Timestamp: new Date().toLocaleString(),
          _captcha: "false"
        })
      });

      if (!response.ok) {
        console.warn("FormSubmit notification response not ok, status:", response.status);
      }
    } catch (err) {
      console.error("Error submitting email notification:", err);
      // We still proceed gracefully so the customer gets a smooth confirmation
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section 
      id="email-signup"
      aria-label="Early Access Newsletter Signup"
      className="py-14 sm:py-24 bg-cream border-t border-charcoal/10"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Pre-header */}
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-charcoal/60 mb-2 inline-block">
          VIP Priority Access
        </span>

        {/* Heading */}
        <h2 className="font-syne text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-charcoal">
          Be the First to Know
        </h2>

        {/* Subtitle */}
        <p className="font-inter text-xs sm:text-base text-charcoal/70 mt-2 sm:mt-3 max-w-lg mx-auto leading-relaxed">
          Be the first to know. Get early access to the first drop.
        </p>

        {/* Form or Success Box */}
        <div className="mt-6 sm:mt-8 max-w-xl mx-auto">
          {isSubmitted ? (
            <div 
              role="status" 
              className="p-5 sm:p-8 bg-charcoal text-cream border border-charcoal animate-fade-in-up flex flex-col items-center"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-3">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-syne text-base sm:text-xl font-bold uppercase tracking-wider">
                Thank you, you're on the list.
              </h3>
              <p className="text-xs sm:text-sm text-cream/80 mt-2 max-w-md">
                We will email you private early-access credentials 2 hours before the public drop.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 sm:mt-5 text-xs text-accent underline hover:text-cream active:text-white transition-colors uppercase tracking-widest py-2"
              >
                Register another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="w-full">
              <div className="flex flex-col sm:flex-row items-stretch border border-charcoal/30 bg-cream-light focus-within:border-charcoal focus-within:ring-1 focus-within:ring-charcoal transition-all shadow-sm">
                <label htmlFor="email-input" className="sr-only">
                  Email Address
                </label>
                {/* 16px text-base prevents iOS Safari unwanted auto-zoom on input focus */}
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'email-error' : undefined}
                  disabled={isSubmitting}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-transparent text-base sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-charcoal text-cream text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 active:scale-[0.99] transition-all shrink-0 disabled:opacity-50 border-t sm:border-t-0 sm:border-l border-charcoal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  id="email-error"
                  role="alert" 
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-600 font-medium animate-fade-in-up"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Privacy guarantee */}
              <p className="text-[10px] sm:text-[11px] text-charcoal/50 mt-2.5 sm:mt-3 text-center">
                Strictly zero spam. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
