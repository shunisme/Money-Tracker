import React from 'react';
import { LayoutDashboard, ReceiptText, BarChart3, Settings, Plus } from 'lucide-react';
import type { ViewTab } from '../../types/finance';

interface MobileNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onOpenSettings,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            currentTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => onSelectTab('transactions')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            currentTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <ReceiptText className="w-5 h-5" />
          <span>Transactions</span>
        </button>

        {/* Center Floating Add Button */}
        <div className="-mt-6">
          <button
            onClick={onOpenAddModal}
            className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 hover:bg-emerald-700 active:scale-95 transition-all"
            aria-label="Add Transaction"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Analytics */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
            currentTab === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
