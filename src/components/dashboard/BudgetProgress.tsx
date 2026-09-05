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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Spending Target</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Budget limit: {formatCurrency(activeBudget)}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Limit</span>
          </button>
        </div>

        {/* Progress Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 pb-1">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Spent
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isOverBudget ? 'Exceeded by' : 'Remaining'}
            </span>
            <p
              className={`text-xl font-bold mt-1 ${
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

        {/* Slim Minimalist Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1.5">
            <span className="text-[11px]">Usage</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
              {formatPercentage(budgetPercentUsed)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
      </div>

      {/* Aesthetic Notice Banners */}
      <div className="mt-5">
        {isOverBudget && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs">
            <AlertOctagon className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span className="font-medium">
              Over budget by <strong className="font-bold">{formatCurrency(Math.abs(budgetRemaining))}</strong> ({formatPercentage(budgetPercentUsed)} used).
            </span>
          </div>
        )}

        {isNearBudget && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span className="font-medium">
              Approaching limit: <strong className="font-bold">{formatPercentage(budgetPercentUsed)}</strong> spent. Only <strong className="font-bold">{formatCurrency(budgetRemaining)}</strong> left.
            </span>
          </div>
        )}

        {!isOverBudget && !isNearBudget && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium px-1">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Well balanced within your monthly spending target.</span>
          </div>
        )}
      </div>
    </div>
  );
};
