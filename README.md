This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# Hidhab Kaizen (هضاب كايزن) 🇩🇿

## Getting Started
Full-stack Algerian e-commerce platform built for **Hidhab Kaizen** with a streamlined **Cash on Delivery (COD)** shopping flow (Browse → Product Detail & Media → 58 Wilayas Dependent Order Form → Instant Confirmation) in **Arabic (Primary, RTL)** and **French (Secondary, LTR)**, backed by a private admin dashboard, Supabase PostgreSQL schema, analytics, delivery pricing management, and courier delivery slips.

First, run the development server:
---

## ✨ Key Features

### 🛍️ Customer-Facing Storefront
- **Bilingual & RTL-First**: Seamless language switcher in the navbar toggling between Arabic (RTL layout) and French (LTR layout) with mirrored icons and directionality.
- **Ordered Minimal Navbar**: Strict requested order (`Logo` → `Products` → `Location` → `Contact` with top-corner language toggle).
- **Editorial Magazine Layout**: Bold typography hero (Cairo & IBM Plex Sans Arabic), asymmetric product card rhythm, hover zooms, and smooth scroll reveals.
- **Rich Media Product Detail**: Multi-image carousel with fullscreen lightbox zoom, plus inline video player (YouTube embed / direct MP4).
- **Fast COD Order Form**:
  - Full Name (الاسم الكامل)
  - Algerian phone format validation (`05/06/07...`)
  - Quantity selector
  - Home Delivery vs Office Pickup toggle
  - **All 58 Algerian Wilayas** dropdown
  - **Dependent Communes dropdown** populated instantly based on selected Wilaya
  - Precise Address & Notes
  - **Live Order Cost Calculator**: Product cost + Wilaya delivery fee = Total to pay upon delivery
  - **Celebration Feedback**: Confetti animation (`canvas-confetti`) with unique order reference ID (e.g. `HK-2026-4891`).
- **Location Page**: Sétif headquarters address, operating hours, and interactive Google Maps embed.
- **Contact Page**: Click-to-call phone buttons, WhatsApp link, verified Facebook, TikTok, and Instagram channels.

### 🛡️ Private Admin Dashboard (`/admin`)
- **Protected Access**: Supabase Auth integration + Instant Demo Login bypass for rapid preview.
- **Interactive Analytics**:
  - Revenue breakdown with toggle to **Include / Exclude delivery fees**.
  - Revenue & Orders volume trends over time (Daily / Weekly / Monthly).
  - Order status distribution (Donut / Pie chart).
  - Logistics demand breakdown: Orders by Wilaya (highlighting top demand provinces).
  - Top 5 best-selling products by quantity and revenue.
  - Average Order Value (AOV) and Return/Cancellation rate.
- **Operational Quick Actions**:
  - "Orders needing confirmation today" (one-click filter).
  - "Orders stuck in Shipped for > 3 days".
  - "Low-stock inventory warnings" (stock ≤ 5).
- **Orders Management**:
  - Full orders table with date, wilaya, commune, address, subtotal, delivery fee, total, and status.
  - Inline status update (`New` → `Confirmed` → `Shipped` → `Delivered` → `Cancelled` → `Returned`).
  - Search by customer name, phone number, or order reference code.
  - Batch **CSV Export** for filtered date ranges.
  - **Internal Staff Notes Drawer** for dispatch notes and courier tracking numbers.
- **Printable Courier Delivery Slip (بيان التوصيل)**:
  - Formatted for standard A4 / A5 / Thermal courier printers.
  - Includes barcodes, sender details, recipient phone and address, goods list, and **Total cash to collect on delivery**.
- **Customer Repeat-Order Lookup (Anti-Fraud / Serial Fake Orders)**:
  - Search by phone number across all historical orders.
  - Computes customer trust score (`High / VIP`, `Standard`, `Risk`) based on past delivery vs return/cancellation rates.
- **58 Wilayas Delivery Pricing Management**:
  - Complete editable table of all 58 Algerian provinces.
  - Edit home delivery and office pickup prices per wilaya.
  - Instant save per row + **Bulk Update** tool (apply to North, South, or all 58 wilayas at once).
- **Products & Categories Management**:
  - Full CRUD with multi-image URL manager, video URL input, pricing, stock count, and active/hidden toggle.

---

## 🏗️ Architecture & Dual Data Mode

The application includes an **intelligent dual-mode data layer** (`src/lib/data-service.ts`):
1. **Live Supabase Mode**: Automatically activates when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided.
2. **Interactive Local Storage Demo Mode**: When unconfigured, the application runs out-of-the-box with preloaded realistic Algerian seed data (products, categories, 58 wilayas delivery rates, orders, analytics). Orders submitted and admin modifications persist in browser storage.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
git clone <repo-url>
cd anti
npm install
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials if using live Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
### 3. Setup Supabase Database
1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Copy and run `supabase/schema.sql` (creates tables, constraints, indexes, RLS policies, and storage bucket).
4. Copy and run `supabase/seed.sql` (seeds 58 wilayas, communes, default delivery fees, categories, products, and sample orders).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (Click *"دخول فوري بحساب تجريبي"* or use your Supabase Auth account).

To learn more about Next.js, take a look at the following resources:
---

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
## 📦 Deployment (Vercel + Supabase)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
### Deploy to Vercel
1. Push your repository to GitHub / GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. In Project Settings > **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Both free-tier friendly!

## Deploy on Vercel
---

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## 📄 License
All rights reserved © 2026 Hidhab Kaizen (هضاب كايزن).
