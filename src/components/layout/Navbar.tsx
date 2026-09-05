import React from 'react';
import {
  Sun,
  Moon,
  Plus,
  Settings,
  Wallet,
  Menu,
  Cloud,
  CloudOff,
  Loader2,
  Smartphone,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { MonthSelector } from '../dashboard/MonthSelector';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
  onOpenPwaModal: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  onOpenPwaModal,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { cloudStatus, user } = useFinance();

  return (
    <header className="sticky top-0 z-30 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
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
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
              MoneyTrack
            </span>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="flex-1 max-w-xs sm:max-w-md flex justify-center">
          <MonthSelector />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
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
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              cloudStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/20'
                : cloudStatus === 'syncing' || cloudStatus === 'connecting'
                ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300 dark:border-amber-500/20'
                : cloudStatus === 'error'
                ? 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300 dark:border-rose-500/20'
                : 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            {cloudStatus === 'connected' ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Cloud Synced</span>
              </>
            ) : cloudStatus === 'syncing' || cloudStatus === 'connecting' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
                <span>Syncing</span>
              </>
            ) : cloudStatus === 'error' ? (
              <>
                <CloudOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Cloud Error</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Local Only</span>
              </>
            )}
          </button>

          {/* User Account / Auth Button */}
          <button
            onClick={onOpenAuthModal}
            title={user ? `Signed in as ${user.email}` : 'Sign in / Create Account'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              user
                ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline max-w-[100px] truncate">
              {user ? user.email?.split('@')[0] : 'Sign In'}
            </span>
          </button>

          {/* PWA Install Button */}
          <button
            onClick={onOpenPwaModal}
            title="Install MoneyTrack on your phone or desktop"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
