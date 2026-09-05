# MoneyTrack

<p align="left">
  <a href="https://money-tracker-2cyr.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-money--tracker--2cyr.vercel.app-059669?style=flat-square&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/shunisme/Money-Tracker" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-8.0-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
</p>

MoneyTrack is a personal finance and budget tracking application designed for daily financial management. It provides monthly cash flow monitoring, expense categorization, recurring subscription tracking, and budget thresholds. The platform operates on a local-first model with optional cloud synchronization.

Live Application: [https://money-tracker-2cyr.vercel.app](https://money-tracker-2cyr.vercel.app)

---

## Overview

MoneyTrack enables users to record transactions, plan monthly expenditure, and analyze spending patterns over time. Built with React and TypeScript, the application stores data locally by default to ensure privacy and offline availability, while supporting multi-user authentication and database replication through Supabase.

---

## Key Features

### Financial Dashboard
The central dashboard displays essential metrics for the active month, including total income, total expenditure, net savings, and the overall savings rate. It also calculates a daily safe-to-spend runway, showing the remaining discretionary budget distributed across the remaining days of the billing cycle.

### Month-over-Month Comparisons
A summary compares current income, expenses, and net savings against the preceding month, presenting variance in both absolute currency amounts and percentages.

### One-Tap Transaction Logging
The interface provides preset shortcuts for frequent routine expenses (such as dining, fuel, and groceries). An undo mechanism remains active for six seconds after entry to reverse accidental submissions.

### Recurring Subscriptions and Bills
A dedicated ledger tracks ongoing monthly and annual commitments such as telecommunication plans, gym memberships, and digital services. The system calculates total monthly fixed burn rates, provides countdown indicators toward renewal dates, and allows one-click conversion of recurring commitments into active monthly expenses.

### Budget Monitoring and Thresholds
Users can establish monthly spending limits. The application monitors utilization and provides visual warnings when expenditure reaches 80 percent of the target, as well as distinct alert notices when limits are exceeded.

### Expense Categorization
Transactions are categorized across standard personal finance headings (food, transport, utilities, education, healthcare, and retail). A proportional donut chart and category table illustrate the distribution of total expenses.

### Multi-Month Analytics
A historical review panel tracks cash flow and net savings velocity across a rolling six-month timeline, highlighting the highest expenditure categories and long-term financial trends.

### Progressive Web App (PWA) Support
The application includes a standard web manifest and service worker configuration, allowing installation on mobile devices (iOS Safari and Android Chrome) as a standalone application without browser interface elements.

### Data Storage and Cloud Synchronization
MoneyTrack follows a local-first architecture. All records are retained within browser storage without requiring an account. Users seeking multi-device access can connect a Supabase PostgreSQL backend, with optional email authentication and row-level security to isolate individual user accounts.

### Data Export and Portability
Users can export their complete transaction history as a comma-separated values (CSV) spreadsheet file for tax documentation or external analysis, or download a full JSON backup.

---

## Technical Specifications

- Client Framework: React 19, TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Iconography: Lucide Icons
- Database and Authentication: Supabase (PostgreSQL, Realtime replication, Row Level Security)
- Deployment : Vercel

---

## Database Configuration

The application operates offline by default using local browser storage. For multi-device cloud synchronization, the required PostgreSQL tables, security policies, and realtime triggers are documented in `supabase/schema.sql`.

---

## License

This project is licensed under the MIT License.
