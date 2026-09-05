import React, { useMemo } from 'react';
import { PiggyBank, Percent, ArrowUpRight, ArrowDownLeft, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercentage, getCurrentMonth } from '../../utils/formatters';

export const MetricCards: React.FC = () => {
  const { metrics, monthlyComparison, activeMonth } = useFinance();
  const { totalIncome, totalExpenses, netSavings, savingsRate, budgetRemaining } = metrics;
  const isSavingsPositive = netSavings >= 0;

  // Calculate remaining days and daily safe-to-spend for active month
  const dailyRunway = useMemo(() => {
    const currentMonth = getCurrentMonth();
    if (activeMonth !== currentMonth) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const daysLeft = Math.max(1, totalDays - now.getDate() + 1);
    const dailySafe = Math.max(0, budgetRemaining / daysLeft);

    return {
      daysLeft,
      dailySafe,
    };
  }, [activeMonth, budgetRemaining]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Income
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalIncome)}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {monthlyComparison.incomeDiff !== 0 ? (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    monthlyComparison.incomeDiff >= 0
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {monthlyComparison.incomeDiff >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {monthlyComparison.incomeDiff >= 0 ? '+' : ''}
                  {formatPercentage(monthlyComparison.incomePercentChange)}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Unchanged</span>
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Expenses
            </span>
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {monthlyComparison.expenseDiff !== 0 ? (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    monthlyComparison.expenseDiff <= 0
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {monthlyComparison.expenseDiff > 0 ? '+' : ''}
                  {formatPercentage(monthlyComparison.expensePercentChange)}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Unchanged</span>
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Net Savings
            </span>
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                isSavingsPositive
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <div
              className={`text-2xl font-bold tracking-tight ${
                isSavingsPositive
                  ? 'text-slate-900 dark:text-white'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(netSavings, true)}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isSavingsPositive
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                }`}
              >
                {isSavingsPositive ? 'Surplus' : 'Deficit'}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">this month</span>
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Savings Rate
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatPercentage(savingsRate)}
            </div>

            <div className="mt-3.5 w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  savingsRate >= 30
                    ? 'bg-emerald-500'
                    : savingsRate > 0
                    ? 'bg-indigo-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Daily Safe Spend Indicator (Active Month Only) */}
      {dailyRunway && (
        <div className="px-5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>
              Daily Safe-to-Spend Runway: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(dailyRunway.dailySafe)}/day</strong> remaining for the next <strong className="text-slate-800 dark:text-slate-200">{dailyRunway.daysLeft} days</strong> of this month.
            </span>
          </div>
          <span className="hidden md:inline-block text-[11px] text-slate-400">
            Based on {formatCurrency(budgetRemaining)} remaining budget
          </span>
        </div>
      )}
    </div>
  );
};
