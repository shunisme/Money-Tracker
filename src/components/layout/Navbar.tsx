import React from 'react';
import { Sun, Moon, Plus, Settings, Wallet, Menu, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { MonthSelector } from '../dashboard/MonthSelector';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenSettingsModal,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { cloudStatus } = useFinance();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left Side: Mobile hamburger + Mobile Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand Logo visible on mobile/tablets */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              MoneyTrack
            </span>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="flex-1 max-w-xs sm:max-w-md flex justify-center">
          <MonthSelector />
        </div>

        {/* Right Controls: Cloud Status, Quick Add, Theme toggle, Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Indicator */}
          <button
            onClick={onOpenSettingsModal}
            title={
              cloudStatus === 'connected'
                ? 'Cloud Synced with Supabase (Click to manage)'
                : cloudStatus === 'syncing'
                ? 'Syncing with Supabase...'
                : cloudStatus === 'connecting'
                ? 'Connecting to Supabase...'
                : cloudStatus === 'error'
                ? 'Cloud Connection Error (Click to check)'
                : 'Local Only (Click to connect Cloud Database)'
            }
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              cloudStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                : cloudStatus === 'syncing' || cloudStatus === 'connecting'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                : cloudStatus === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cloudStatus === 'connected' ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">Cloud Synced</span>
              </>
            ) : cloudStatus === 'syncing' || cloudStatus === 'connecting' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
                <span className="hidden md:inline">Syncing</span>
              </>
            ) : cloudStatus === 'error' ? (
              <>
                <CloudOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden md:inline">Cloud Error</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Local Only</span>
              </>
            )}
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            title="Settings & Data"
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
