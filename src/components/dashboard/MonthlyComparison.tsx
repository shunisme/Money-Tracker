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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Month-over-Month Comparison</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Comparing {currMonthLabel} against {prevMonthLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Income Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Income Velocity
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentIncome)}
            </span>
            <div
              className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                incomeDiff >= 0
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
              }`}
            >
              {incomeDiff >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>
                {incomeDiff >= 0 ? '+' : ''}
                {formatPercentage(incomePercentChange)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
            <span>Last month: {formatCurrency(previousIncome)}</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {incomeDiff >= 0 ? '+' : ''}
              {formatCurrency(incomeDiff)}
            </span>
          </div>
        </div>

        {/* Expenses Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Spending Velocity
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentExpenses)}
            </span>
            <div
              className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                expenseDiff <= 0
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
              }`}
            >
              {expenseDiff <= 0 ? (
                <ArrowDownRight className="w-3 h-3" />
              ) : (
                <ArrowUpRight className="w-3 h-3" />
              )}
              <span>
                {expenseDiff > 0 ? '+' : ''}
                {formatPercentage(expensePercentChange)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
            <span>Last month: {formatCurrency(previousExpenses)}</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {expenseDiff >= 0 ? '+' : ''}
              {formatCurrency(expenseDiff)}
            </span>
          </div>
        </div>

        {/* Savings Comparison */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Savings Variance
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentSavings)}
            </span>
            <div
              className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                savingsDiff >= 0
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
              }`}
            >
              {savingsDiff >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>
                {savingsDiff >= 0 ? '+' : ''}
                {formatPercentage(savingsPercentChange)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
            <span>Last month: {formatCurrency(previousSavings)}</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {savingsDiff >= 0 ? '+' : ''}
              {formatCurrency(savingsDiff)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
