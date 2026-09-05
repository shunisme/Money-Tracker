import type {
  Transaction,
  MonthlyMetrics,
  CategorySummary,
  MonthlyComparison,
} from '../types/finance';
import { shiftMonth } from './formatters';

/**
 * Filter transactions that belong to a specific month (YYYY-MM)
 */
export const filterTransactionsByMonth = (
  transactions: Transaction[],
  monthStr: string
): Transaction[] => {
  return transactions.filter((t) => t.date.startsWith(monthStr));
};

/**
 * Compute monthly metrics: total income, total expenses, net savings, savings rate, budget stats
 */
export const calculateMonthlyMetrics = (
  transactions: Transaction[],
  monthStr: string,
  budget: number = 0
): MonthlyMetrics => {
  const monthTransactions = filterTransactionsByMonth(transactions, monthStr);

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of monthTransactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else if (t.type === 'expense') {
      totalExpenses += t.amount;
    }
  }

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const budgetRemaining = budget - totalExpenses;
  const budgetPercentUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    budget,
    budgetRemaining,
    budgetPercentUsed,
  };
};

/**
 * Group expenses by category and calculate totals & percentages
 */
export const calculateCategoryBreakdown = (
  transactions: Transaction[],
  monthStr: string,
  type: 'expense' | 'income' = 'expense'
): CategorySummary[] => {
  const monthTransactions = filterTransactionsByMonth(transactions, monthStr).filter(
    (t) => t.type === type
  );

  const totalAmount = monthTransactions.reduce((acc, t) => acc + t.amount, 0);
  const map = new Map<string, { amount: number; count: number }>();

  for (const t of monthTransactions) {
    const existing = map.get(t.category) || { amount: 0, count: 0 };
    map.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  }

  const breakdown: CategorySummary[] = [];
  map.forEach((value, category) => {
    breakdown.push({
      category: category as any,
      type,
      amount: value.amount,
      percentage: totalAmount > 0 ? (value.amount / totalAmount) * 100 : 0,
      count: value.count,
    });
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
};

/**
 * Compare current month against previous month
 */
export const calculateMonthlyComparison = (
  transactions: Transaction[],
  currentMonth: string
): MonthlyComparison => {
  const previousMonth = shiftMonth(currentMonth, -1);

  const currentMetrics = calculateMonthlyMetrics(transactions, currentMonth);
  const prevMetrics = calculateMonthlyMetrics(transactions, previousMonth);

  const incomeDiff = currentMetrics.totalIncome - prevMetrics.totalIncome;
  const incomePercentChange =
    prevMetrics.totalIncome > 0
      ? (incomeDiff / prevMetrics.totalIncome) * 100
      : currentMetrics.totalIncome > 0
      ? 100
      : 0;

  const expenseDiff = currentMetrics.totalExpenses - prevMetrics.totalExpenses;
  const expensePercentChange =
    prevMetrics.totalExpenses > 0
      ? (expenseDiff / prevMetrics.totalExpenses) * 100
      : currentMetrics.totalExpenses > 0
      ? 100
      : 0;

  const savingsDiff = currentMetrics.netSavings - prevMetrics.netSavings;
  const savingsPercentChange =
    Math.abs(prevMetrics.netSavings) > 0
      ? (savingsDiff / Math.abs(prevMetrics.netSavings)) * 100
      : currentMetrics.netSavings > 0
      ? 100
      : 0;

  return {
    currentMonth,
    previousMonth,
    currentIncome: currentMetrics.totalIncome,
    previousIncome: prevMetrics.totalIncome,
    incomeDiff,
    incomePercentChange,
    currentExpenses: currentMetrics.totalExpenses,
    previousExpenses: prevMetrics.totalExpenses,
    expenseDiff,
    expensePercentChange,
    currentSavings: currentMetrics.netSavings,
    previousSavings: prevMetrics.netSavings,
    savingsDiff,
    savingsPercentChange,
  };
};

/**
 * Get aggregated data for last N months for trends
 */
export interface MonthTrendData {
  month: string;
  monthLabel: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export const calculateTrends = (
  transactions: Transaction[],
  months: string[]
): MonthTrendData[] => {
  return months.map((month) => {
    const metrics = calculateMonthlyMetrics(transactions, month);
    const [y, m] = month.split('-').map(Number);
    const date = new Date(y, m - 1, 1);
    const monthLabel = new Intl.DateTimeFormat('en-MY', { month: 'short' }).format(date);

    return {
      month,
      monthLabel,
      income: metrics.totalIncome,
      expenses: metrics.totalExpenses,
      savings: metrics.netSavings,
      savingsRate: metrics.savingsRate,
    };
  });
};
