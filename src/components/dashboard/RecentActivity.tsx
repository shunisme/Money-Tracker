import React from 'react';
import { History, Plus, ArrowRight, Trash2, Edit3 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_CONFIGS } from '../../constants/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import type { Transaction } from '../../types/finance';

interface RecentActivityProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
  onViewAll: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  onViewAll,
}) => {
  const { activeMonthTransactions } = useFinance();

  // Sort by date descending (newest first)
  const sorted = [...activeMonthTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentTransactions = sorted.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Latest transactions for this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>All ({activeMonthTransactions.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800/60">
        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            <p>No transactions recorded yet for this month.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-500/10 dark:text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record first transaction</span>
            </button>
          </div>
        ) : (
          recentTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const config = CATEGORY_CONFIGS[tx.category] || CATEGORY_CONFIGS.Other;

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${config.color}15`,
                      color: config.color,
                    }}
                  >
                    <CategoryIcon category={tx.category} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tx.description || config.label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {formatDate(tx.date)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${config.color}15`,
                          color: config.color,
                        }}
                      >
                        {tx.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold tracking-tight ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {formatCurrency(tx.amount, true)}
                    </div>
                  </div>

                  {/* Actions visible on hover */}
                  <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="Edit transaction"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx)}
                      title="Delete transaction"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
