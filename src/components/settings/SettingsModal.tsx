import React, { useState, useRef } from 'react';
import {
  X,
  Settings,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Coins,
  CheckCircle2,
  AlertCircle,
  Cloud,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Database,
  ArrowUpCircle,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { exportDataAsJSON } from '../../utils/storage';
import { ConfirmModal } from '../common/ConfirmModal';

const SCHEMA_SQL = `-- MoneyTrack Cloud Database Setup (Paste into Supabase SQL Editor)
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budgets (
    month TEXT PRIMARY KEY,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on transactions" ON public.transactions FOR DELETE USING (true);

CREATE POLICY "Allow public read on budgets" ON public.budgets FOR SELECT USING (true);
CREATE POLICY "Allow public all on budgets" ON public.budgets FOR ALL USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;`;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    clearAllData,
    resetToDemoData,
    importData,
    transactions,
    cloudStatus,
    cloudConfig,
    cloudError,
    connectCloud,
    disconnectCloud,
    syncWithCloud,
    pushAllToCloud,
  } = useFinance();

  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cloud form state
  const [supabaseUrl, setSupabaseUrl] = useState(cloudConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(cloudConfig.anonKey);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleExport = () => {
    try {
      const dataStr = exportDataAsJSON();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `moneytrack_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('success', 'Data exported successfully as JSON!');
    } catch (err: any) {
      showNotification('error', `Export failed: ${err.message}`);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importData(content);
      if (res.success) {
        showNotification('success', res.message);
      } else {
        showNotification('error', res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    clearAllData();
    showNotification('success', 'All local financial data has been completely erased.');
  };

  const handleResetDemo = () => {
    resetToDemoData();
    showNotification('success', 'Sample Malaysian demo transactions restored!');
  };

  const handleConnectCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      showNotification('error', 'Please enter both Supabase Project URL and Anon Key.');
      return;
    }

    setIsConnecting(true);
    const result = await connectCloud(supabaseUrl.trim(), supabaseKey.trim());
    setIsConnecting(false);

    if (result.success) {
      showNotification('success', result.message);
    } else {
      showNotification('error', result.message);
    }
  };

  const handleDisconnectCloud = () => {
    disconnectCloud();
    setSupabaseUrl('');
    setSupabaseKey('');
    showNotification('success', 'Disconnected from Supabase. App will operate in local mode.');
  };

  const handleManualSync = async () => {
    try {
      await syncWithCloud();
      showNotification('success', 'Successfully synchronized with cloud database!');
    } catch (err: any) {
      showNotification('error', `Sync failed: ${err.message}`);
    }
  };

  const handlePushAll = async () => {
    const res = await pushAllToCloud();
    if (res.success) {
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setHasCopiedSql(true);
    setTimeout(() => setHasCopiedSql(false), 2500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Settings & Data</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cloud sync, backups, and preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Status notification toast */}
            {notification && (
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
            )}

            {/* SECTION 1: CLOUD DATABASE (SUPABASE) */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Cloud Database (Supabase)</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sync your records in real time across mobile & desktop
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 ${
                    cloudStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : cloudStatus === 'error'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cloudStatus === 'connected'
                        ? 'bg-emerald-500 animate-pulse'
                        : cloudStatus === 'error'
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    {cloudStatus === 'connected'
                      ? 'Connected'
                      : cloudStatus === 'error'
                      ? 'Error'
                      : 'Disconnected'}
                  </span>
                </span>
              </div>

              {/* Cloud Error Display */}
              {cloudError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Cloud Connection Notice</p>
                    <p className="text-[11px] mt-0.5">{cloudError}</p>
                  </div>
                </div>
              )}

              {/* Cloud Connected Controls */}
              {cloudStatus === 'connected' ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Endpoint</span>
                      <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                        {cloudConfig.url}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectCloud}
                      className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleManualSync}
                      className="flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Sync Latest</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePushAll}
                      className="flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Push Local Data</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Disconnected / Configure Form */
                <form onSubmit={handleConnectCloud} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Supabase Anon / Public Key
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSqlGuide(!showSqlGuide)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Setup instructions & SQL</span>
                      {showSqlGuide ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="submit"
                      disabled={isConnecting}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      {isConnecting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Cloud className="w-3.5 h-3.5" />
                      )}
                      <span>Connect Cloud</span>
                    </button>
                  </div>

                  {/* Collapsible Supabase Setup Guide */}
                  {showSqlGuide && (
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>How to setup Supabase (Free & Instant)</span>
                        <a
                          href="https://supabase.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                        >
                          <span>supabase.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        <li>Create a free account and new project on Supabase.</li>
                        <li>Open the <strong>SQL Editor</strong> tab in your project dashboard.</li>
                        <li>Paste the SQL schema below and click <strong>Run</strong>:</li>
                      </ol>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={handleCopySql}
                          className="absolute right-2 top-2 p-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          {hasCopiedSql ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy SQL</span>
                            </>
                          )}
                        </button>
                        <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36">
                          {SCHEMA_SQL}
                        </pre>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Then go to <strong>Project Settings → API</strong> to copy your Project URL and Anon key.
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* SECTION 2: CURRENCY & LOCALE */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Currency & Format</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Malaysian Ringgit (MYR - RM)
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                RM
              </span>
            </div>

            {/* SECTION 3: BACKUP & RESTORE */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Offline Backup & Restore
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 p-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl border border-slate-200/60 dark:border-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl border border-slate-200/60 dark:border-slate-700 transition-colors"
                >
                  <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Import JSON</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </div>
            </div>

            {/* SECTION 4: RESET & WIPE */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Data Reset Options
              </h4>

              {/* Reset to Demo Data */}
              <button
                type="button"
                onClick={() => setIsConfirmResetOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-indigo-500" />
                  <div className="text-left">
                    <p className="text-xs font-bold">Reset to Demo Sample Data</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Restores realistic Malaysian sample records
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Reset
                </span>
              </button>

              {/* Clear All Data */}
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <div className="text-left">
                    <p className="text-xs font-bold">Clear All Data</p>
                    <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70">
                      Delete all {transactions.length} transactions and budgets
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Delete All
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        onConfirm={handleClearAll}
        title="Wipe All Financial Records?"
        message="This action is irreversible. All of your tracked transactions, categories, and monthly budget targets will be permanently deleted."
        confirmLabel="Yes, Clear Everything"
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleResetDemo}
        title="Reset to Sample Data?"
        message="This will replace your current records with realistic pre-configured Malaysian sample transactions across the last 6 months."
        confirmLabel="Reset to Demo Data"
        isDestructive={false}
      />
    </>
  );
};
