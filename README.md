# MoneyTrack 💳

<p align="center">
  <img src="public/favicon.svg" alt="MoneyTrack Logo" width="72" height="72" />
</p>

<p align="center">
  <strong>A modern, minimalist, and aesthetic personal finance & budget tracker.</strong><br>
  Local-first privacy, real-time Supabase cloud sync, recurring subscriptions tracker, and installable PWA for mobile.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-8.0-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/PWA-Ready-f05032?style=flat-square" alt="PWA Ready" />
</p>

---

## ✨ Features

### 1. 📊 Fintech Dashboard & Intelligence
- **Real-Time Financial Metrics**: Total Income, Total Expenses, Net Savings (surplus/deficit), and dynamic Savings Rate meter.
- **⚡ Daily Safe-to-Spend Runway**: Automatically calculates how much you can spend per day for the rest of the month without exceeding your budget (e.g. *RM 42.50/day safe spend*).
- **Month-over-Month Comparison**: Side-by-side variance analysis of income, expenses, and savings velocity against the previous month.
- **Month Navigation**: Effortlessly switch between months with Previous/Next controls, native date pickers, or quick jump back to the current month.

### 2. ⚡ 1-Tap Quick Add Presets
- **Instant Logging**: Quick chips on the dashboard for frequent daily Malaysian spends:
  - `Mamak / Lunch` (+RM 15.00)
  - `Petrol Refill` (+RM 50.00)
  - `Kopi / Drink` (+RM 6.00)
  - `Grocery Run` (+RM 35.00)
  - `Grab / Transit` (+RM 20.00)
- **Instant Undo Protection**: Displays a 6-second floating toast with an **Undo** button to revert accidental taps with zero hassle.

### 3. 🔁 Subscriptions & Recurring Bills Tracker
- **Dedicated Subscriptions Ledger**: Track fixed commitments (Netflix, Spotify, Maxis/Unifi Fibre, Gym, iCloud).
- **Burn Rate Analytics**: View total monthly fixed burn rate and projected annual commitments.
- **Renewal Countdown Badges**:
  - 🔴 **Renews Today!** badge when a bill is due today.
  - 🟡 **In X days** warning badge when renewal is within 3 days.
- **1-Click Expense Logging**: Tap **"Log Expense"** on any subscription to immediately log an expense transaction for the active month without typing anything.

### 4. 🎯 Smart Budgeting & Category Breakdown
- **Spending Budget Alerts**: Set monthly budget targets with quick presets (`RM 2,000` to `RM 8,000`).
  - Warning at 80% usage.
  - Urgent red alert when exceeding 100% with exact excess amount.
- **Interactive SVG Donut Chart**: Minimalist 12px ring stroke with category progress bars, transaction counts, and hover expansion.

### 5. 📈 6-Month Analytics & Trends
- **Cash Flow History**: 6-month dual-bar comparison of Monthly Income vs Monthly Expenses with hover tooltips.
- **Savings Velocity Trend**: Visualize positive surplus vs deficit months.
- **Category Leaderboard**: Top spending categories ranked with expenditure and percentage share.

### 6. 📲 Progressive Web App (PWA)
- **Installable on Mobile & Desktop**: Open in Safari (iOS) or Chrome (Android) and tap **"Add to Home Screen"** to run as a fullscreen standalone app without browser address bars.
- Includes built-in guided install modal with platform-specific instructions.

### 7. ☁️ Supabase Cloud Database & Multi-User Auth
- **Local-First Architecture**: 100% functional offline without an account. All data persists in browser `localStorage`.
- **User Accounts (Supabase Auth)**: Optional Email/Password Sign In & Sign Up. Data is partitioned by `user_id` via PostgreSQL Row Level Security (RLS).
- **Real-Time Cross-Device Sync**: Subscribes to Supabase Realtime WebSocket replication so additions on your phone reflect on your laptop instantly.

### 8. 📥 Data Portability & Dark Mode
- **CSV / Excel Export**: One-click spreadsheet export for expense reviews or tax filing.
- **Offline JSON Backup**: Export or import your entire transaction history and budgets in JSON format.
- **Scandinavian Minimalist Dark/Light Mode**: Polished, high-contrast, eye-friendly theme with persistent state.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL & Realtime Replication)
- **Deployment**: [Vercel](https://vercel.com/)
- **PWA**: Web App Manifest & Service Worker standard

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/shunisme/Money-Tracker.git
cd Money-Tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## ☁️ Connecting Supabase (Optional)

MoneyTrack works completely offline with LocalStorage out of the box. To enable multi-device cloud synchronization:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
4. In MoneyTrack, click the **Settings (gear icon)** at the top right.
5. Enter your **Project URL** and **Anon Key** (found in Supabase *Project Settings → API*) and click **"Connect Cloud"**.

> *Alternatively, create a `.env.local` file with:*
> ```env
> VITE_SUPABASE_URL=https://your-project.supabase.co
> VITE_SUPABASE_ANON_KEY=your-anon-public-key
> ```

---

## 🚀 Deploying to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
3. Import your **`Money-Tracker`** repository.
4. Framework Preset: **Vite** (auto-detected).
5. *(Optional)* Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables.
6. Click **"Deploy"**!

---

## 📄 License

This project is licensed under the MIT License.
