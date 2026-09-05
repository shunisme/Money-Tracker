import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit3,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type {
  Transaction,
  SortOrder,
} from '../../types/finance';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_CONFIGS,
} from '../../constants/categories';
import { formatCurrency, formatDate, formatMonthYear } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

interface TransactionListProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const { transactions, activeMonth } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOrder>('newest');
  const [monthScope, setMonthScope] = useState<'current' | 'all'>('current');

  // Filter & Sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month scope
      if (monthScope === 'current' && !tx.date.startsWith(activeMonth)) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesCat = tx.category.toLowerCase().includes(query);
        const matchesAmount = tx.amount.toString().includes(query);
        if (!matchesDesc && !matchesCat && !matchesAmount) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, activeMonth, monthScope, typeFilter, categoryFilter, searchQuery, sortBy]);

  // Aggregate stats for filtered list
  const filteredTotalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const filteredTotalExpenses = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Header & Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Transactions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {monthScope === 'current'
                ? `Showing transactions for ${formatMonthYear(activeMonth)}`
                : 'Showing all recorded transactions across all months'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scope Switcher: Current Month vs All Time */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setMonthScope('current')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  monthScope === 'current'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Selected Month
              </button>
              <button
                onClick={() => setMonthScope('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  monthScope === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Months
              </button>
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Filter bar: Search, Type Tabs, Category dropdown, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'income'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <optgroup label="Expenses">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Income">
                {INCOME_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOrder)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filter summary bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredTransactions.length}</strong> transactions
          </span>
          <div className="flex items-center gap-4 mt-1 sm:mt-0">
            <span>
              Income: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(filteredTotalIncome)}</strong>
            </span>
            <span>
              Expenses: <strong className="text-rose-600 dark:text-rose-400">{formatCurrency(filteredTotalExpenses)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <Layers className="w-12 h-12 mx-auto stroke-1 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold">No transactions match your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new transaction.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const config = CATEGORY_CONFIGS[tx.category] || CATEGORY_CONFIGS.Other;

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      <CategoryIcon category={tx.category} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {tx.description}
                        </span>
                        <span
                          className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${config.color}20`,
                            color: config.color,
                          }}
                        >
                          {tx.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatDate(tx.date)}</span>
                        <span className="sm:hidden text-slate-300 dark:text-slate-700">•</span>
                        <span
                          className="sm:hidden text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${config.color}20`,
                            color: config.color,
                          }}
                        >
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-base font-extrabold tracking-tight ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {formatCurrency(tx.amount, true)}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isIncome ? 'text-emerald-500' : 'text-slate-400'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        title="Edit transaction"
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx)}
                        title="Delete transaction"
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
