export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Education'
  | 'Health'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Allowance'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string; // 'YYYY-MM-DD'
  createdAt?: string;
}

export interface MonthlyBudget {
  month: string; // 'YYYY-MM'
  amount: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  billingDay: number; // 1-31
  category: TransactionCategory;
  autoRenew: boolean;
  notes?: string;
  createdAt?: string;
}

export interface MonthlyMetrics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage 0-100
  budget: number;
  budgetRemaining: number;
  budgetPercentUsed: number;
}

export interface CategorySummary {
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyComparison {
  currentMonth: string;
  previousMonth: string;
  currentIncome: number;
  previousIncome: number;
  incomeDiff: number;
  incomePercentChange: number;
  currentExpenses: number;
  previousExpenses: number;
  expenseDiff: number;
  expensePercentChange: number;
  currentSavings: number;
  previousSavings: number;
  savingsDiff: number;
  savingsPercentChange: number;
}

export type ViewTab = 'dashboard' | 'transactions' | 'subscriptions' | 'analytics' | 'budget';

export type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface QuickPreset {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  createdAt?: string;
}
