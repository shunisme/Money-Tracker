import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Settings,
  Wallet,
  PiggyBank,
  X,
} from 'lucide-react';
import type { ViewTab } from '../../types/finance';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatMonthShort } from '../../utils/formatters';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenSettings: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { metrics, activeMonth, activeMonthTransactions } = useFinance();

  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'transactions' as ViewTab,
      label: 'Transactions',
      icon: ReceiptText,
      badge: activeMonthTransactions.length,
    },
    {
      id: 'analytics' as ViewTab,
      label: 'Analytics & Trends',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  MoneyTrack
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1 block">
                  Fintech Suite
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Active Month Savings Snapshot + Settings button */}
        <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
          {/* Quick Snapshot Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>{formatMonthShort(activeMonth)} Savings</span>
              <PiggyBank className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <p
              className={`text-sm font-extrabold mt-1 ${
                metrics.netSavings >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(metrics.netSavings, true)}
            </p>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
