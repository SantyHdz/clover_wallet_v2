# Clover Wallet

Personal finance web app to track income, expenses, debts and loans in one place. This is v2: a refactor of the first version, rebuilt with better practices.

**Live demo:** https://clover-wallet-amber.vercel.app
**Backend repo:** https://github.com/SantyHdz/Clover_Wallet_BACKEND

## Features

- Record and categorize income and expenses, including recurring ones
- Filter by category, month and year to spot unnecessary spending
- Debts and loans, kept separate: money you owe and money you lent
- Partial repayments with progress bars
- Reports: breakdown by category, monthly comparison, annual history, net balance and savings
- Dashboard with totals, pending debts, receivables and estimated savings
- Dark mode

## Tech stack

- Next.js and TypeScript
- [Confirm and edit: Tailwind CSS, shadcn/ui]
- Backend: Python API on Render (see the backend repo)
- Frontend deployed on Vercel

## Run locally

```bash
git clone https://github.com/SantyHdz/clover_wallet_v2.git
cd clover_wallet_v2
npm install
# create .env.local with the backend URL: [add the variable name you use]
npm run dev
```

Open http://localhost:3000.

## Screenshots

[Add 2 or 3 screenshots here: dashboard, debts, reports]

## Author

Santiago Hernandez – full-stack developer. [GitHub](https://github.com/SantyHdz)
