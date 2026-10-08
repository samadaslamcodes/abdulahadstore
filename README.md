# ADAAB OFFICIAL — Coming Soon Page

A clean, minimal, luxury streetwear "Coming Soon" landing page for **ADAAB OFFICIAL** (A-D-A-A-B).

## Tech Stack
- **React (Vite)** + **Tailwind CSS**
- **lucide-react** for iconography
- **Google Fonts**: *Syne* (Wordmark & Headings) and *Inter* (Body typography)
- Fully responsive, mobile-first design with accessible navigation and interactive forms

## Brand Palette
- **Cream**: `#F5F3EE`
- **Charcoal**: `#111111`
- **Accent Warm Sand**: `#C9B79C`

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## Project Structure

```
├── public/
│   └── favicon.svg               # Minimalist ADAAB monogram favicon
├── src/
│   ├── assets/
│   │   ├── images.js             # Central image configuration (easy photo swap)
│   │   └── placeholder-hero.svg  # Offline vector fallback
│   ├── components/
│   │   ├── AnnouncementBar.jsx   # Top marquee strip ("New Collection Dropping Soon")
│   │   ├── Navbar.jsx            # Scroll-reactive sticky nav + mobile drawer
│   │   ├── Hero.jsx              # Banner, countdown timer, and CTAs
│   │   ├── CountdownTimer.jsx    # Live countdown clock to launch date
│   │   ├── CategoryStrip.jsx     # 4 minimal cards (Waffle Polo, Full Sleeves, etc.)
│   │   ├── BrandStatement.jsx    # "Minimal. Sharp. Made to be worn daily."
│   │   ├── EmailSignup.jsx       # Client-side validated VIP early-access form
│   │   └── Footer.jsx            # Wordmark, social links, direct contact
│   ├── App.jsx                   # Main layout integration
│   ├── index.css                 # Tailwind base styles and subtle animations
│   └── main.jsx                  # React application entry point
├── index.html                    # SEO meta tags, title, and Google Fonts
├── tailwind.config.js            # Custom colors (cream, charcoal, accent) & fonts
├── vite.config.js                # Vite configuration
└── package.json
```

---

## Customization Guide

### 1. Changing the Launch Date
Open [`src/components/Hero.jsx`](src/components/Hero.jsx) and edit the constant at the top:
```javascript
export const LAUNCH_DATE = "2026-12-01T00:00:00";
```

### 2. Replacing Placeholder Images
Open [`src/assets/images.js`](src/assets/images.js) to swap any placeholder image with your own files or hosted photo URLs:
```javascript
import myHero from './my-model-photo.jpg';
export const heroImage = myHero;
```

### 3. Connecting Email Newsletter to a Backend
Open [`src/components/EmailSignup.jsx`](src/components/EmailSignup.jsx) and locate `handleSubmit`. Replace the simulated timeout with your preferred email marketing API (e.g. Klaviyo, Mailchimp, or custom REST endpoint).

