# Clover Wallet

Personal finance app to track income and expenses, debts, loans and savings, with charts and exportable reports.

**Live demo:** https://clover-wallet-amber.vercel.app/
**Backend repo:** https://github.com/SantyHdz/Clover_Wallet_BACKEND

## Features

- Account registration and login
- Income and expense tracking with categories
- Debts and loans with repayment tracking
- Savings goals
- Dashboard with charts and animated figures
- PDF report export
- Guided onboarding tour for new users
- Responsive layout with light and dark themes

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, Lucide icons, Sonner |
| Data and forms | TanStack Query, React Hook Form, Zod, Axios |
| Charts and reports | Recharts, React PDF |
| Auth and backend | Better Auth, Supabase, FastAPI API (separate repo) |
| Onboarding | Driver.js |

## Run locally

```bash
git clone https://github.com/SantyHdz/clover_wallet_v2.git
cd clover_wallet_v2
npm install
npm run dev
```

Open http://localhost:3000. The app needs the [Clover Wallet backend](https://github.com/SantyHdz/Clover_Wallet_BACKEND) running to load data.

## Author

Santiago Hernandez, full-stack developer. [GitHub](https://github.com/SantyHdz)
