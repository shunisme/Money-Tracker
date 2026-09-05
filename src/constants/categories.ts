import type { ExpenseCategory, IncomeCategory, TransactionCategory } from '../types/finance';

export interface CategoryConfig {
  id: TransactionCategory;
  label: string;
  type: 'expense' | 'income';
  color: string;
  bgLight: string;
  bgDark: string;
  textColor: string;
  iconName: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Other',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Allowance',
  'Freelance',
  'Investment',
  'Other',
];

export const CATEGORY_CONFIGS: Record<TransactionCategory, CategoryConfig> = {
  // Expenses
  Food: {
    id: 'Food',
    label: 'Food & Dining',
    type: 'expense',
    color: '#d97706', // Warm amber latte
    bgLight: 'bg-amber-500/10 text-amber-900 dark:text-amber-200',
    bgDark: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    iconName: 'UtensilsCrossed',
  },
  Transport: {
    id: 'Transport',
    label: 'Transport & Fuel',
    type: 'expense',
    color: '#0284c7', // Slate cyan/denim
    bgLight: 'bg-sky-500/10 text-sky-900 dark:text-sky-200',
    bgDark: 'bg-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    iconName: 'Car',
  },
  Shopping: {
    id: 'Shopping',
    label: 'Shopping',
    type: 'expense',
    color: '#db2777', // Dusty rose
    bgLight: 'bg-pink-500/10 text-pink-900 dark:text-pink-200',
    bgDark: 'bg-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    iconName: 'ShoppingBag',
  },
  Bills: {
    id: 'Bills',
    label: 'Bills & Utilities',
    type: 'expense',
    color: '#4f46e5', // Muted ink indigo
    bgLight: 'bg-indigo-500/10 text-indigo-900 dark:text-indigo-200',
    bgDark: 'bg-indigo-500',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    iconName: 'Receipt',
  },
  Entertainment: {
    id: 'Entertainment',
    label: 'Entertainment',
    type: 'expense',
    color: '#7c3aed', // Soft iris
    bgLight: 'bg-violet-500/10 text-violet-900 dark:text-violet-200',
    bgDark: 'bg-violet-500',
    textColor: 'text-violet-600 dark:text-violet-400',
    iconName: 'Gamepad2',
  },
  Education: {
    id: 'Education',
    label: 'Education & Books',
    type: 'expense',
    color: '#0d9488', // Spruce teal
    bgLight: 'bg-teal-500/10 text-teal-900 dark:text-teal-200',
    bgDark: 'bg-teal-500',
    textColor: 'text-teal-600 dark:text-teal-400',
    iconName: 'GraduationCap',
  },
  Health: {
    id: 'Health',
    label: 'Health & Medical',
    type: 'expense',
    color: '#e11d48', // Terracotta rose
    bgLight: 'bg-rose-500/10 text-rose-900 dark:text-rose-200',
    bgDark: 'bg-rose-500',
    textColor: 'text-rose-600 dark:text-rose-400',
    iconName: 'HeartPulse',
  },
  // Income
  Salary: {
    id: 'Salary',
    label: 'Salary & Wages',
    type: 'income',
    color: '#059669', // Sage forest emerald
    bgLight: 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
    bgDark: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    iconName: 'Briefcase',
  },
  Allowance: {
    id: 'Allowance',
    label: 'Allowance',
    type: 'income',
    color: '#0f766e', // Muted pine
    bgLight: 'bg-teal-500/10 text-teal-900 dark:text-teal-200',
    bgDark: 'bg-teal-500',
    textColor: 'text-teal-600 dark:text-teal-400',
    iconName: 'Wallet',
  },
  Freelance: {
    id: 'Freelance',
    label: 'Freelance & Side Gig',
    type: 'income',
    color: '#2563eb', // Cobalt blue
    bgLight: 'bg-blue-500/10 text-blue-900 dark:text-blue-200',
    bgDark: 'bg-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    iconName: 'Laptop',
  },
  Investment: {
    id: 'Investment',
    label: 'Investment & Dividends',
    type: 'income',
    color: '#6366f1', // Soft violet indigo
    bgLight: 'bg-indigo-500/10 text-indigo-900 dark:text-indigo-200',
    bgDark: 'bg-indigo-500',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    iconName: 'TrendingUp',
  },
  Other: {
    id: 'Other',
    label: 'Other',
    type: 'expense',
    color: '#64748b', // Slate graphite
    bgLight: 'bg-slate-500/10 text-slate-800 dark:text-slate-200',
    bgDark: 'bg-slate-500',
    textColor: 'text-slate-600 dark:text-slate-400',
    iconName: 'MoreHorizontal',
  },
};

export const DEFAULT_MONTHLY_BUDGET = 3500;
