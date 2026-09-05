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
    color: '#f97316', // orange-500
    bgLight: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    bgDark: 'bg-orange-500',
    textColor: 'text-orange-500',
    iconName: 'UtensilsCrossed',
  },
  Transport: {
    id: 'Transport',
    label: 'Transport & Fuel',
    type: 'expense',
    color: '#0284c7', // sky-600
    bgLight: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    bgDark: 'bg-sky-500',
    textColor: 'text-sky-500',
    iconName: 'Car',
  },
  Shopping: {
    id: 'Shopping',
    label: 'Shopping',
    type: 'expense',
    color: '#ec4899', // pink-500
    bgLight: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    bgDark: 'bg-pink-500',
    textColor: 'text-pink-500',
    iconName: 'ShoppingBag',
  },
  Bills: {
    id: 'Bills',
    label: 'Bills & Utilities',
    type: 'expense',
    color: '#eab308', // yellow-500
    bgLight: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    bgDark: 'bg-amber-500',
    textColor: 'text-amber-500',
    iconName: 'Receipt',
  },
  Entertainment: {
    id: 'Entertainment',
    label: 'Entertainment',
    type: 'expense',
    color: '#8b5cf6', // purple-500
    bgLight: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    bgDark: 'bg-purple-500',
    textColor: 'text-purple-500',
    iconName: 'Gamepad2',
  },
  Education: {
    id: 'Education',
    label: 'Education & Books',
    type: 'expense',
    color: '#06b6d4', // cyan-500
    bgLight: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300',
    bgDark: 'bg-cyan-500',
    textColor: 'text-cyan-500',
    iconName: 'GraduationCap',
  },
  Health: {
    id: 'Health',
    label: 'Health & Medical',
    type: 'expense',
    color: '#ef4444', // red-500
    bgLight: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    bgDark: 'bg-red-500',
    textColor: 'text-red-500',
    iconName: 'HeartPulse',
  },
  // Income
  Salary: {
    id: 'Salary',
    label: 'Salary & Wages',
    type: 'income',
    color: '#10b981', // emerald-500
    bgLight: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    bgDark: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    iconName: 'Briefcase',
  },
  Allowance: {
    id: 'Allowance',
    label: 'Allowance',
    type: 'income',
    color: '#14b8a6', // teal-500
    bgLight: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    bgDark: 'bg-teal-500',
    textColor: 'text-teal-500',
    iconName: 'Wallet',
  },
  Freelance: {
    id: 'Freelance',
    label: 'Freelance & Side Gig',
    type: 'income',
    color: '#3b82f6', // blue-500
    bgLight: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    bgDark: 'bg-blue-500',
    textColor: 'text-blue-500',
    iconName: 'Laptop',
  },
  Investment: {
    id: 'Investment',
    label: 'Investment & Dividends',
    type: 'income',
    color: '#6366f1', // indigo-500
    bgLight: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    bgDark: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    iconName: 'TrendingUp',
  },
  Other: {
    id: 'Other',
    label: 'Other',
    type: 'expense',
    color: '#64748b', // slate-500
    bgLight: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    bgDark: 'bg-slate-500',
    textColor: 'text-slate-500',
    iconName: 'MoreHorizontal',
  },
};

export const DEFAULT_MONTHLY_BUDGET = 3500;
