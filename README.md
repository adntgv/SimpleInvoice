# 🧾 SimpleInvoice

**Free invoicing for freelancers.** Create professional invoices in seconds, share them with a link, track payments — no signup required.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)
![License](https://img.shields.io/badge/license-MIT-gray)

## ✨ Features

- **⚡ Create in seconds** — Clean invoice builder with line items, tax, and notes
- **📄 PDF download** — Print-optimized invoices, save as PDF from any browser
- **🔗 Share links** — Every invoice gets a unique shareable URL
- **📊 Dashboard** — Track all invoices with status filters and financial overview
- **🆓 No signup needed** — Create up to 3 invoices without an account
- **🔐 Secure** — Supabase Auth with email/password and Google OAuth
- **🌙 Dark mode** — Beautiful dark theme, easy on the eyes
- **📱 Responsive** — Works perfectly on mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Supabase project (or use the included migration)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/simple-invoice.git
cd simple-invoice

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the database migration
# Copy supabase/migrations/001_initial.sql to your Supabase SQL editor and run it

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start invoicing.

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| PDF | Browser Print API |
| Deployment | Docker / Coolify / Vercel |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── create/page.tsx       # Invoice builder
│   ├── dashboard/page.tsx    # Invoice list & stats
│   ├── invoice/[id]/page.tsx # Public invoice view
│   ├── auth/page.tsx         # Sign in / Sign up
│   └── api/invoices/route.ts # API endpoints
├── components/
│   ├── InvoiceForm.tsx       # Invoice creation form
│   ├── InvoicePreview.tsx    # Paper-like invoice view
│   ├── InvoicePDF.tsx        # PDF generation
│   ├── Header.tsx            # Navigation header
│   └── Footer.tsx            # Site footer
└── lib/
    ├── supabase.ts           # Browser Supabase client
    ├── supabase-server.ts    # Server Supabase client
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # Utility functions
```

## 🐳 Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -t simple-invoice .

docker run -p 3000:3000 simple-invoice
```

## 💰 Pricing

| | Free | Pro ($9/mo) |
|--|------|------------|
| Invoices | 3 | Unlimited |
| PDF Download | ✅ | ✅ |
| Share Links | ✅ | ✅ |
| Status Tracking | ✅ | ✅ |
| Branding Removal | ❌ | ✅ |
| Recurring Invoices | ❌ | ✅ |
| Priority Support | ❌ | ✅ |

## 📄 License

MIT — do whatever you want with it.

---

Built with ☕ for freelancers who want to get paid, not manage software.
