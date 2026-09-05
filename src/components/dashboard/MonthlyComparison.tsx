import React from 'react';
import { ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercentage, formatMonthShort } from '../../utils/formatters';

export const MonthlyComparison: React.FC = () => {
  const { monthlyComparison } = useFinance();
  const {
    currentMonth,
    previousMonth,
    currentIncome,
    previousIncome,
    incomeDiff,
    incomePercentChange,
    currentExpenses,
    previousExpenses,
    expenseDiff,
    expensePercentChange,
    currentSavings,
    previousSavings,
    savingsDiff,
    savingsPercentChange,
  } = monthlyComparison;

  const prevMonthLabel = formatMonthShort(previousMonth);
  const currMonthLabel = formatMonthShort(currentMonth);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Summary & Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing {currMonthLabel} with {prevMonthLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Income Change</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentIncome)}
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                incomeDiff >= 0
                  ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'text-rose-700 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
              }`}
            >
              {incomeDiff >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>
                {incomeDiff >= 0 ? '+' : ''}
                {formatPercentage(incomePercentChange)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Last month: {formatCurrency(previousIncome)}</span>
            <span className="font-semibold">
              {incomeDiff >= 0 ? '+' : ''}
              {formatCurrency(incomeDiff)}
            </span>
          </div>
        </div>

        {/* Expenses Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spending Change</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentExpenses)}
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                expenseDiff <= 0
                  ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'text-rose-700 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
              }`}
            >
              {expenseDiff <= 0 ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5" />
              )}
              <span>
                {expenseDiff > 0 ? '+' : ''}
                {formatPercentage(expensePercentChange)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Last month: {formatCurrency(previousExpenses)}</span>
            <span className="font-semibold">
              {expenseDiff >= 0 ? '+' : ''}
              {formatCurrency(expenseDiff)}
            </span>
          </div>
        </div>

        {/* Savings Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Savings Change</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentSavings)}
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                savingsDiff >= 0
                  ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'text-rose-700 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
              }`}
            >
              {savingsDiff >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>
                {savingsDiff >= 0 ? '+' : ''}
                {formatPercentage(savingsPercentChange)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Last month: {formatCurrency(previousSavings)}</span>
            <span className="font-semibold">
              {savingsDiff >= 0 ? '+' : ''}
              {formatCurrency(savingsDiff)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
