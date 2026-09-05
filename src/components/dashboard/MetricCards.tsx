import React from 'react';
import { PiggyBank, Percent, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export const MetricCards: React.FC = () => {
  const { metrics, monthlyComparison } = useFinance();
  const { totalIncome, totalExpenses, netSavings, savingsRate } = metrics;
  const isSavingsPositive = netSavings >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Income */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {monthlyComparison.incomeDiff !== 0 ? (
              <>
                <span
                  className={`inline-flex items-center font-semibold ${
                    monthlyComparison.incomeDiff >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {monthlyComparison.incomeDiff >= 0 ? '+' : ''}
                  {formatPercentage(monthlyComparison.incomePercentChange)}
                </span>
                <span>vs last month</span>
              </>
            ) : (
              <span>Same as last month</span>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
      </div>

      {/* Total Expenses */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {monthlyComparison.expenseDiff !== 0 ? (
              <>
                <span
                  className={`inline-flex items-center font-semibold ${
                    monthlyComparison.expenseDiff <= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {monthlyComparison.expenseDiff > 0 ? '+' : ''}
                  {formatPercentage(monthlyComparison.expensePercentChange)}
                </span>
                <span>vs last month</span>
              </>
            ) : (
              <span>Same as last month</span>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-400" />
      </div>

      {/* Net Savings */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Savings
          </span>
          <div
            className={`p-2.5 rounded-2xl ${
              isSavingsPositive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isSavingsPositive
                ? 'text-slate-900 dark:text-white'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(netSavings, true)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span
              className={`font-semibold ${
                isSavingsPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isSavingsPositive ? 'Surplus' : 'Deficit'}
            </span>
            <span>this month</span>
          </div>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
            isSavingsPositive
              ? 'from-blue-500 to-indigo-500'
              : 'from-rose-500 to-red-600'
          }`}
        />
      </div>

      {/* Savings Rate */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Savings Rate
          </span>
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatPercentage(savingsRate)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>of total income saved</span>
          </div>
        </div>
        {/* Visual Mini Gauge Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
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
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      </div>
    </div>
  );
};
