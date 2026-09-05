import React from 'react';
import { Target, AlertTriangle, AlertOctagon, CheckCircle2, Edit3 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface BudgetProgressProps {
  onOpenBudgetModal: () => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ onOpenBudgetModal }) => {
  const { metrics, activeBudget } = useFinance();
  const { totalExpenses, budgetRemaining, budgetPercentUsed } = metrics;

  const isOverBudget = budgetPercentUsed > 100;
  const isNearBudget = budgetPercentUsed >= 80 && !isOverBudget;
  const clampedProgress = Math.min(100, Math.max(0, budgetPercentUsed));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Spending Budget</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Budget: {formatCurrency(activeBudget)}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Budget</span>
        </button>
      </div>

      {/* Progress Stats */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Spent so far</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isOverBudget ? 'Exceeded by' : 'Remaining'}
          </span>
          <p
            className={`text-lg font-bold mt-0.5 ${
              isOverBudget
                ? 'text-rose-600 dark:text-rose-400'
                : isNearBudget
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isOverBudget
              ? formatCurrency(Math.abs(budgetRemaining))
              : formatCurrency(budgetRemaining)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Usage</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {formatPercentage(budgetPercentUsed)}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-rose-500'
                : isNearBudget
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      {/* Warning Banners */}
      {isOverBudget && (
        <div className="mt-4 flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300">
          <AlertOctagon className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Budget Exceeded!</span> You have surpassed your monthly budget by{' '}
            <span className="font-semibold">{formatCurrency(Math.abs(budgetRemaining))}</span> ({formatPercentage(budgetPercentUsed)} used). Consider pausing non-essential expenses.
          </div>
        </div>
      )}

      {isNearBudget && (
        <div className="mt-4 flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Budget Warning:</span> You have utilized{' '}
            <span className="font-semibold">{formatPercentage(budgetPercentUsed)}</span> of your monthly budget. Only{' '}
            <span className="font-semibold">{formatCurrency(budgetRemaining)}</span> remaining.
          </div>
        </div>
      )}

      {!isOverBudget && !isNearBudget && (
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>You are well within your planned spending target for this month.</span>
        </div>
      )}
    </div>
  );
};
