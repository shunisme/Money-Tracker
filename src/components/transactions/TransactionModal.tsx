import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type {
  Transaction,
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  TransactionCategory,
} from '../../types/finance';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_CONFIGS } from '../../constants/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { getTodayDate } from '../../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: Transaction | null;
  defaultMonth?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
  defaultMonth,
}) => {
  const isEditing = Boolean(editingTransaction);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDate());
  const [errors, setErrors] = useState<{ amount?: string; description?: string; date?: string }>({});

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setErrors({});
    } else {
      setType('expense');
      setAmount('');
      setCategory('Food');
      setDescription('');
      // Set date to today or within default month
      const today = getTodayDate();
      if (defaultMonth && !today.startsWith(defaultMonth)) {
        setDate(`${defaultMonth}-01`);
      } else {
        setDate(today);
      }
      setErrors({});
    }
  }, [editingTransaction, isOpen, defaultMonth]);

  // When type changes, ensure valid default category for that type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      if (!EXPENSE_CATEGORIES.includes(category as ExpenseCategory)) {
        setCategory('Food');
      }
    } else {
      if (!INCOME_CATEGORIES.includes(category as IncomeCategory)) {
        setCategory('Salary');
      }
    }
  };

  const validate = () => {
    const newErrors: { amount?: string; description?: string; date?: string } = {};

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than RM 0.00';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a short description or note';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      type,
      category,
      description: description.trim(),
      date,
    });

    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing
                ? 'Update transaction details'
                : 'Record your expense or income with details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Type Toggle: Income vs Expense */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  type === 'expense'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Expense</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  type === 'income'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Amount (MYR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                RM
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border rounded-2xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.amount
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.amount}</p>
            )}
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentCategories.map((cat) => {
                const config = CATEGORY_CONFIGS[cat] || CATEGORY_CONFIGS.Other;
                const isSelected = category === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-1.5"
                      style={{
                        backgroundColor: `${config.color}20`,
                        color: config.color,
                      }}
                    >
                      <CategoryIcon category={cat} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold truncate max-w-full">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Village Park Nasi Lemak, Grocery at Jaya Grocer..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.date
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
              }`}
            />
            {errors.date && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.date}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
