# Luiscart — Premium E-Commerce

A modern, high-fidelity audio and headphone e-commerce storefront built to showcase wireless headphones, studio acoustic gear, noise-cancelling earbuds, and sports audio. Designed with an emerald-and-gold visual identity inspired by the **Luiscart** brand logo and the exact structural layout of your reference design.

![Luiscart Logo](assets/images/logo.png)

---

## Features

- **Brand Identity**: Custom deep emerald slate (`#071a17` / `#0c3a35`), champagne gold accents (`#c5a869`), and luxury typography.
- **Top Utility Bar**: Phone concierge (`+91 9746359282`), seasonal promo announcement, language switcher, and multi-currency selector (`USD $`, `EUR €`, `GBP £`, `INR ₹`, `AED د.إ`).
- **Main Navigation Header**: Sticky navigation with brand monogram, Category mega-menu, pill-shaped live search input with instant suggestions, Account and Cart badges.
- **Hero Promotional Banner Card**: High-contrast headline (*"Grab Upto 50% Off On Selected Headphone"*), pill `Buy Now` CTA button, and high-res lifestyle imagery.
- **Horizontal Filter Pills Bar**: Interactive filter pills matching reference:
  - `Headphone Type ▾` (Over-Ear, Earbuds & TWS, Noise Cancelling, Sports & Open-Ear, Studio Audiophile)
  - `Price ▾` (Under $100, $100-$300, $300-$600, Over $600)
  - `Review ▾` (4.8★ & above, 5.0★)
  - `Color ▾` (Black, Champagne Gold, Crimson, Azure)
  - `Material ▾` (Titanium, Aluminum, Memory Foam & Leather, Polymer)
  - `Offer ▾` (50% Off, Best Seller, New Arrival, Exclusive Drop)
  - `All Filters 🎛️`
  - `Sort by ▾` (Price Low-High, High-Low, Rating, Most Reviewed, Featured)
- **Product Grid (4-Column Layout)**:
  - Soft off-white cards (`rounded-2xl`).
  - Floating circular white wishlist button (heart icon).
  - High-resolution studio product photos with hover zoom.
  - Title and price row (`$89.00`).
  - 1-line feature subtitle description.
  - 5-star rating with review count: `★★★★★ (121)`.
  - Pill `Add to Cart` button with active state styling.
- **Quick View Modal**: Deep-dive product window with photo gallery, specifications, and quantity stepper.
- **Slide-over Cart Drawer**: Real-time quantity adjuster, coupon code engine (`LUIS50` for 50% off, `VIP10` for 10% off), free shipping milestone meter, and subtotal calculation.
- **WhatsApp Instant Ordering (+91 9746359282)**:
  - **Cart Drawer**: Dedicated prominent green *"Order via WhatsApp"* button that formats all items, quantities, colors, discounts, and total into a structured WhatsApp message.
  - **Quick View Modal**: Instant *"Direct WhatsApp Order"* button for single-item 1-click ordering.
  - **Checkout Form**: First-choice payment option *"WhatsApp Instant Order"*, automatically dispatching full customer name, phone, delivery address, and order list to WhatsApp.
- **Persistent Storage**: Cart, Wishlist, and selected Currency automatically persist across browser refreshes via `localStorage`.

---

## How to Run

### Method 1: Instant Local Server (Recommended)
Double-click `start-store.bat` or run:
```bash
node serve.js
```
Then visit **http://localhost:3000** in any browser.

### Method 2: Direct File Open
You can also directly double-click `index.html` in your file explorer to open it in Chrome, Edge, Safari, or Firefox without any server required!
