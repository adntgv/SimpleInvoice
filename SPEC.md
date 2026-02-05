# SimpleInvoice — Product Spec

## Overview
Minimalist web app for freelancers to create, send, and track invoices. No signup required for first 3 invoices.

## Target Audience
- Freelancers & solo consultants
- Small agencies & contractors
- Anyone who needs quick, professional invoices

## Monetization
- **Free tier:** 3 invoices, PDF download, shareable links
- **Pro ($9/mo):** Unlimited invoices, branding removal, recurring invoices, priority support

## Core Features (MVP)
1. **Invoice Builder** — Clean form with client details, line items, tax, notes, due date
2. **PDF Generation** — Print-optimized HTML with browser Save-as-PDF
3. **Share Links** — Each invoice gets a unique URL
4. **Status Tracking** — Draft → Sent → Paid / Overdue
5. **Dashboard** — List all invoices with status filters and financial summary
6. **Anonymous Mode** — First 3 invoices stored via anonymous token (localStorage)
7. **Auth** — Supabase Auth (email/password + Google OAuth)

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (dark theme)
- Supabase (Auth + PostgreSQL + RLS)

## Database
- Single `invoices` table with JSONB line items
- Row Level Security for user isolation
- Anonymous token support for unauthenticated users

## Design Principles
- Dark, minimal, professional
- Invoice preview looks like real paper
- Mobile-responsive
- Fast — minimal dependencies
