import React, { useState } from 'react';
import { Zap, Check, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, getTodayDate } from '../../utils/formatters';
import type { TransactionCategory } from '../../types/finance';

interface Preset {
  id: string;
  name: string;
  amount: number;
  category: TransactionCategory;
  description: string;
}

const DEFAULT_PRESETS: Preset[] = [
  { id: '1', name: 'Mamak / Lunch', amount: 15, category: 'Food', description: 'Lunch / Mamak' },
  { id: '2', name: 'Petrol Refill', amount: 50, category: 'Transport', description: 'Petrol RON95' },
  { id: '3', name: 'Kopi / Drink', amount: 6, category: 'Food', description: 'Coffee / Drink' },
  { id: '4', name: 'Grocery Run', amount: 35, category: 'Food', description: 'Groceries' },
  { id: '5', name: 'Grab / Transit', amount: 20, category: 'Transport', description: 'Grab / Transit fare' },
];

export const QuickAddPresets: React.FC = () => {
  const { addTransaction, deleteTransaction } = useFinance();
  const [lastAddedTx, setLastAddedTx] = useState<{ id: string; name: string; amount: number } | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleQuickAdd = (preset: Preset) => {
    const today = getTodayDate();
    const newTx = addTransaction({
      amount: preset.amount,
      category: preset.category,
      type: 'expense',
      description: preset.description,
      date: today,
    });

    setLastAddedTx({ id: newTx.id, name: preset.name, amount: preset.amount });
    setJustAddedId(preset.id);

    // Reset button tick feedback after 1.2 seconds
    setTimeout(() => {
      setJustAddedId((prev) => (prev === preset.id ? null : prev));
    }, 1200);

    // Auto-dismiss undo after 6 seconds
    setTimeout(() => {
      setLastAddedTx((prev) => (prev?.id === newTx.id ? null : prev));
    }, 6000);
  };

  const handleUndo = () => {
    if (lastAddedTx) {
      deleteTransaction(lastAddedTx.id);
      setLastAddedTx(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            1-Tap Quick Presets
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            Tap to record instantly
          </span>
        </div>

        {/* Undo Toast */}
        {lastAddedTx && (
          <div className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs animate-in fade-in slide-in-from-top-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span className="text-[11px] font-medium truncate max-w-[140px]">
              Logged {formatCurrency(lastAddedTx.amount)}
            </span>
            <button
              onClick={handleUndo}
              className="font-bold underline text-[11px] flex items-center gap-0.5 hover:text-emerald-900 dark:hover:text-white ml-1"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Undo</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DEFAULT_PRESETS.map((preset) => {
          const isJustAdded = justAddedId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleQuickAdd(preset)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                isJustAdded
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/30 scale-105'
                  : 'bg-slate-100/90 hover:bg-emerald-500/10 dark:bg-slate-800/80 dark:hover:bg-emerald-500/20 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              {isJustAdded && (
                <Check className="w-3.5 h-3.5 animate-in zoom-in-50 duration-200 text-white" />
              )}
              <span>{isJustAdded ? 'Added!' : preset.name}</span>
              <span
                className={`text-[11px] font-bold ${
                  isJustAdded ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                +{formatCurrency(preset.amount)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
