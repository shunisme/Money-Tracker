import React, { useState, useEffect } from 'react';
import { X, Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { activeMonth, activeBudget, setMonthlyBudget } = useFinance();
  const [budgetAmount, setBudgetAmount] = useState<string>(activeBudget.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBudgetAmount(activeBudget.toString());
    setError(null);
  }, [activeBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(budgetAmount);
    if (!budgetAmount || isNaN(num) || num <= 0) {
      setError('Please enter a valid budget amount greater than RM 0.00');
      return;
    }

    setMonthlyBudget(activeMonth, Math.round(num * 100) / 100);
    onClose();
  };

  const presetAmounts = [2000, 3000, 3500, 5000, 8000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Monthly Budget</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                For {formatMonthYear(activeMonth)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Spending Limit Target (MYR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                RM
              </span>
              <input
                type="number"
                step="50"
                min="1"
                placeholder="3,500.00"
                value={budgetAmount}
                onChange={(e) => {
                  setBudgetAmount(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                }`}
              />
            </div>
            {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setBudgetAmount(amt.toString());
                    if (error) setError(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    budgetAmount === amt.toString()
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Threshold Explanation Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Threshold Alerts</span>
            </div>
            <p>• Warning triggers at <strong className="text-amber-600 dark:text-amber-400">80%</strong> of budget.</p>
            <p>• Red over-budget alert displays when spending exceeds <strong className="text-rose-600 dark:text-rose-400">100%</strong>.</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
