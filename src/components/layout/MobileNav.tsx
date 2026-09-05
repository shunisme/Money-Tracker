import React from 'react';
import { LayoutDashboard, ReceiptText, CalendarClock, BarChart3, Settings, Plus } from 'lucide-react';
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 pb-safe">
      <div className="flex items-center justify-around px-1 py-1.5">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => onSelectTab('transactions')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <ReceiptText className="w-4 h-4" />
          <span>Activity</span>
        </button>

        {/* Center Floating Add Button */}
        <div className="-mt-5">
          <button
            onClick={onOpenAddModal}
            className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all"
            aria-label="Add Transaction"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Subscriptions */}
        <button
          onClick={() => onSelectTab('subscriptions')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'subscriptions'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          <span>Bills</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            currentTab === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Insights</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Config</span>
        </button>
      </div>
    </div>
  );
};
