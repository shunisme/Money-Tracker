import React, { useState } from 'react';
import { Zap, Check, RotateCcw, Plus, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, getTodayDate } from '../../utils/formatters';
import type { QuickPreset } from '../../types/finance';
import { QuickPresetModal } from './QuickPresetModal';

export const QuickAddPresets: React.FC = () => {
  const {
    quickPresets,
    addQuickPreset,
    updateQuickPreset,
    deleteQuickPreset,
    addTransaction,
    deleteTransaction,
  } = useFinance();

  const [lastAddedTx, setLastAddedTx] = useState<{ id: string; name: string; amount: number } | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<QuickPreset | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);

  const handleQuickAdd = (preset: QuickPreset) => {
    const today = getTodayDate();
    const newTx = addTransaction({
      amount: preset.amount,
      category: preset.category,
      type: preset.type || 'expense',
      description: preset.description || preset.name,
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

  const handleOpenAdd = () => {
    setEditingPreset(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (preset: QuickPreset) => {
    setEditingPreset(preset);
    setIsModalOpen(true);
  };

  const handleSavePreset = (data: Omit<QuickPreset, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      updateQuickPreset(id, data);
    } else {
      addQuickPreset(data);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
      {/* Header with Title and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              1-Tap Quick Presets
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline ml-2">
              Tap to record instantly
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

          {/* Manage / Add Preset Buttons */}
          {quickPresets.length > 0 && (
            <button
              onClick={() => setIsManageMode(!isManageMode)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                isManageMode
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-200/70 dark:hover:bg-slate-700'
              }`}
            >
              {isManageMode ? 'Done' : 'Edit Presets'}
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Add Preset</span>
          </button>
        </div>
      </div>

      {/* Preset Chips or Clean Empty State */}
      {quickPresets.length === 0 ? (
        <div className="py-5 px-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No quick presets configured yet
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Add your daily coffee, lunch, petrol, or frequent expenses to record with 1 tap.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create 1st Preset</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPresets.map((preset) => {
            const isJustAdded = justAddedId === preset.id;
            const isIncome = preset.type === 'income';

            if (isManageMode) {
              return (
                <div
                  key={preset.id}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-indigo-300 dark:border-indigo-800 animate-in fade-in"
                >
                  <span className="font-bold">{preset.name}</span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {formatCurrency(preset.amount)}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(preset)}
                    title="Edit preset"
                    className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteQuickPreset(preset.id)}
                    title="Delete preset"
                    className="p-1 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            }

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
                    isJustAdded
                      ? 'text-emerald-100'
                      : isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isIncome ? '+' : ''}{formatCurrency(preset.amount)}
                </span>
              </button>
            );
          })}

          {/* Quick inline "+ Add" chip button at the end */}
          <button
            onClick={handleOpenAdd}
            title="Add another quick preset"
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>
      )}

      {/* Preset Modal */}
      <QuickPresetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPreset(null);
        }}
        onSave={handleSavePreset}
        onDelete={deleteQuickPreset}
        editingPreset={editingPreset}
      />
    </div>
  );
};
