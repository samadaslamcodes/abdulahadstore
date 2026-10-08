import React, { useState, useEffect } from 'react';

/**
 * CountdownTimer Component
 * Calculates and displays remaining time until the launch date.
 * Fully responsive and optimized for mobile screens.
 */
export default function CountdownTimer({ targetDate = "2026-12-01T00:00:00" }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  // Helper to format with leading zeros
  const formatNumber = (num) => String(num).padStart(2, '0');

  if (timeLeft.expired) {
    return (
      <div className="inline-block py-2.5 px-5 bg-charcoal text-cream uppercase tracking-widest font-syne text-xs sm:text-sm font-semibold border border-charcoal">
        The First Drop Has Landed
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4 sm:my-8 px-1 sm:px-0">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-charcoal/70 mb-2 sm:mb-3 text-center font-medium">
        Official Drop Countdown
      </p>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center py-2 px-1 sm:p-4 bg-cream/95 backdrop-blur-sm border border-charcoal/20 transition-all hover:border-charcoal/40"
          >
            <span className="font-syne text-xl sm:text-3xl md:text-5xl font-bold tracking-tight text-charcoal tabular-nums leading-none">
              {formatNumber(unit.value)}
            </span>
            <span className="text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-charcoal/60 mt-1 sm:mt-1.5 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

