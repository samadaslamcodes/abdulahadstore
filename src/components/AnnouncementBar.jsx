import React from 'react';

/**
 * AnnouncementBar Component
 * Thin top banner highlighting the upcoming drop.
 */
export default function AnnouncementBar() {
  return (
    <aside 
      aria-label="Announcement"
      className="bg-charcoal text-cream text-[11px] sm:text-xs tracking-widest uppercase py-2.5 px-4 text-center border-b border-charcoal/20 select-none font-medium flex items-center justify-center gap-2"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block"></span>
      <span>New Collection Dropping Soon</span>
      <span className="text-accent/60 hidden sm:inline">•</span>
      <span className="text-cream/70 hidden sm:inline normal-case tracking-normal text-[11px]">Limited First Edition</span>
    </aside>
  );
}

