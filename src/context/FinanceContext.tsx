import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import type {
  Transaction,
  Subscription,
  MonthlyMetrics,
  CategorySummary,
  MonthlyComparison,
  QuickPreset,
} from '../types/finance';
import {
  loadStoredTransactions,
  saveStoredTransactions,
  loadStoredBudgets,
  saveStoredBudgets,
  loadStoredSubscriptions,
  saveStoredSubscriptions,
  loadStoredPresets,
  saveStoredPresets,
  clearAllStorage,
  resetToSampleData,
  importDataFromJSON,
} from '../utils/storage';
import {
  calculateMonthlyMetrics,
  calculateCategoryBreakdown,
  calculateMonthlyComparison,
  filterTransactionsByMonth,
} from '../utils/calculations';
import { getCurrentMonth, shiftMonth } from '../utils/formatters';
import { DEFAULT_MONTHLY_BUDGET } from '../constants/categories';
import {
  getCloudConfig,
  saveCloudConfig,
  clearCloudConfig,
  testCloudConnection,
  getSupabaseClient,
  getAuthUser,
  type CloudConfig,
} from '../services/supabaseClient';
import {
  fetchCloudTransactions,
  fetchCloudBudgets,
  fetchCloudSubscriptions,
  pushTransactionToCloud,
  updateCloudTransaction,
  deleteCloudTransaction,
  pushSubscriptionToCloud,
  deleteCloudSubscription,
  saveCloudBudget,
  pushLocalDataToCloud,
  subscribeToCloudRealtime,
} from '../services/cloudSync';

export type CloudStatus = 'connected' | 'connecting' | 'disconnected' | 'syncing' | 'error';

interface FinanceContextType {
  transactions: Transaction[];
  subscriptions: Subscription[];
  quickPresets: QuickPreset[];
  user: User | null;
  activeMonth: string;
  budgets: Record<string, number>;
  activeBudget: number;
  metrics: MonthlyMetrics;
  categoryBreakdown: CategorySummary[];
  monthlyComparison: MonthlyComparison;
  activeMonthTransactions: Transaction[];
  cloudStatus: CloudStatus;
  cloudConfig: CloudConfig;
  cloudError: string | null;
  setActiveMonth: (month: string) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  addSubscription: (data: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, data: Partial<Omit<Subscription, 'id' | 'createdAt'>>) => void;
  deleteSubscription: (id: string) => void;
  addQuickPreset: (data: Omit<QuickPreset, 'id' | 'createdAt'>) => QuickPreset;
  updateQuickPreset: (id: string, data: Partial<Omit<QuickPreset, 'id' | 'createdAt'>>) => void;
  deleteQuickPreset: (id: string) => void;
  setMonthlyBudget: (month: string, amount: number) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  importData: (jsonString: string) => { success: boolean; message: string };
  connectCloud: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
  disconnectCloud: () => void;
  syncWithCloud: () => Promise<void>;
  pushAllToCloud: () => Promise<{ success: boolean; message: string }>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStoredTransactions());
  const [budgets, setBudgets] = useState<Record<string, number>>(() => loadStoredBudgets());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadStoredSubscriptions());
  const [quickPresets, setQuickPresets] = useState<QuickPreset[]>(() => loadStoredPresets());
  const [user, setUser] = useState<User | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>(() => getCurrentMonth());

  const [cloudConfig, setCloudConfigState] = useState<CloudConfig>(() => getCloudConfig());
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(() =>
    getCloudConfig().isConfigured ? 'connecting' : 'disconnected'
  );
  const [cloudError, setCloudError] = useState<string | null>(null);

  // Save changes to localStorage immediately (local-first)
  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    saveStoredSubscriptions(subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    saveStoredPresets(quickPresets);
  }, [quickPresets]);

  // Check auth user and listen to auth state changes
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setUser(null);
      return;
    }

    getAuthUser().then((u) => setUser(u));

    const {
      data: { subscription: authListener },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        syncWithCloud();
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [cloudConfig.isConfigured]);

  // Sync data with cloud
  const syncWithCloud = useCallback(async () => {
    const config = getCloudConfig();
    if (!config.isConfigured) {
      setCloudStatus('disconnected');
      return;
    }

    setCloudStatus('syncing');
    setCloudError(null);

    try {
      const [remoteTxs, remoteBudgets, remoteSubs] = await Promise.all([
        fetchCloudTransactions(),
        fetchCloudBudgets(),
        fetchCloudSubscriptions(),
      ]);

      if (remoteTxs !== null) {
        if (remoteTxs.length > 0) {
          setTransactions(remoteTxs);
        } else if (transactions.length > 0) {
          await pushLocalDataToCloud(transactions, budgets);
        }
      }

      if (remoteBudgets !== null && Object.keys(remoteBudgets).length > 0) {
        setBudgets(remoteBudgets);
      }

      if (remoteSubs !== null && remoteSubs.length > 0) {
        setSubscriptions(remoteSubs);
      }

      setCloudStatus('connected');
    } catch (err: any) {
      console.error('Failed to sync with cloud:', err);
      setCloudStatus('error');
      setCloudError(err.message || 'Failed to sync with cloud database');
    }
  }, [transactions, budgets]);

  // Initial cloud sync & connection test
  useEffect(() => {
    const config = getCloudConfig();
    if (!config.isConfigured) {
      setCloudStatus('disconnected');
      return;
    }

    setCloudStatus('connecting');
    testCloudConnection().then((res) => {
      if (res.success) {
        syncWithCloud();
      } else {
        setCloudStatus('error');
        setCloudError(res.message);
      }
    });
  }, [cloudConfig.isConfigured]);

  // Setup real-time listeners for live multi-device sync
  useEffect(() => {
    if (cloudStatus !== 'connected') return;

    const unsubscribe = subscribeToCloudRealtime(
      async () => {
        const remoteTxs = await fetchCloudTransactions();
        if (remoteTxs) setTransactions(remoteTxs);
      },
      async () => {
        const remoteBudgets = await fetchCloudBudgets();
        if (remoteBudgets) setBudgets(remoteBudgets);
      },
      async () => {
        const remoteSubs = await fetchCloudSubscriptions();
        if (remoteSubs) setSubscriptions(remoteSubs);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [cloudStatus]);

  const activeBudget = useMemo(() => {
    return budgets[activeMonth] ?? DEFAULT_MONTHLY_BUDGET;
  }, [budgets, activeMonth]);

  const metrics = useMemo(() => {
    return calculateMonthlyMetrics(transactions, activeMonth, activeBudget);
  }, [transactions, activeMonth, activeBudget]);

  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(transactions, activeMonth, 'expense');
  }, [transactions, activeMonth]);

  const monthlyComparison = useMemo(() => {
    return calculateMonthlyComparison(transactions, activeMonth);
  }, [transactions, activeMonth]);

  const activeMonthTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, activeMonth);
  }, [transactions, activeMonth]);

  const prevMonth = () => {
    setActiveMonth((curr) => shiftMonth(curr, -1));
  };

  const nextMonth = () => {
    setActiveMonth((curr) => shiftMonth(curr, 1));
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    // 1. Instant local update
    setTransactions((prev) => [newTx, ...prev]);

    // 2. Async cloud push in background
    if (cloudStatus === 'connected') {
      pushTransactionToCloud(newTx).catch((e) =>
        console.error('Background cloud insert failed:', e)
      );
    }

    const txMonth = data.date.substring(0, 7);
    if (txMonth !== activeMonth) {
      setActiveMonth(txMonth);
    }

    return newTx;
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );

    if (cloudStatus === 'connected') {
      updateCloudTransaction(id, data).catch((e) =>
        console.error('Background cloud update failed:', e)
      );
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    if (cloudStatus === 'connected') {
      deleteCloudTransaction(id).catch((e) =>
        console.error('Background cloud delete failed:', e)
      );
    }
  };

  const addSubscription = (data: Omit<Subscription, 'id' | 'createdAt'>) => {
    const newSub: Subscription = {
      ...data,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    setSubscriptions((prev) => [...prev, newSub]);

    if (cloudStatus === 'connected') {
      pushSubscriptionToCloud(newSub).catch((e) =>
        console.error('Background cloud subscription insert failed:', e)
      );
    }
  };

  const updateSubscription = (
    id: string,
    data: Partial<Omit<Subscription, 'id' | 'createdAt'>>
  ) => {
    let updatedSub: Subscription | null = null;
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          updatedSub = { ...sub, ...data };
          return updatedSub;
        }
        return sub;
      })
    );

    if (cloudStatus === 'connected' && updatedSub) {
      pushSubscriptionToCloud(updatedSub).catch((e) =>
        console.error('Background cloud subscription update failed:', e)
      );
    }
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));

    if (cloudStatus === 'connected') {
      deleteCloudSubscription(id).catch((e) =>
        console.error('Background cloud subscription delete failed:', e)
      );
    }
  };

  const addQuickPreset = (data: Omit<QuickPreset, 'id' | 'createdAt'>): QuickPreset => {
    const newPreset: QuickPreset = {
      ...data,
      id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    setQuickPresets((prev) => [...prev, newPreset]);
    return newPreset;
  };

  const updateQuickPreset = (
    id: string,
    data: Partial<Omit<QuickPreset, 'id' | 'createdAt'>>
  ) => {
    setQuickPresets((prev) =>
      prev.map((preset) => (preset.id === id ? { ...preset, ...data } : preset))
    );
  };

  const deleteQuickPreset = (id: string) => {
    setQuickPresets((prev) => prev.filter((preset) => preset.id !== id));
  };

  const setMonthlyBudget = (month: string, amount: number) => {
    setBudgets((prev) => ({
      ...prev,
      [month]: amount,
    }));

    if (cloudStatus === 'connected') {
      saveCloudBudget(month, amount).catch((e) =>
        console.error('Background cloud budget save failed:', e)
      );
    }
  };

  const connectCloud = async (
    url: string,
    anonKey: string
  ): Promise<{ success: boolean; message: string }> => {
    setCloudStatus('connecting');
    setCloudError(null);

    const testRes = await testCloudConnection(url, anonKey);
    if (!testRes.success) {
      setCloudStatus('error');
      setCloudError(testRes.message);
      return testRes;
    }

    saveCloudConfig(url, anonKey);
    setCloudConfigState(getCloudConfig());
    await syncWithCloud();

    return {
      success: true,
      message: 'Successfully connected to Supabase Cloud Database!',
    };
  };

  const disconnectCloud = () => {
    clearCloudConfig();
    setCloudConfigState(getCloudConfig());
    setCloudStatus('disconnected');
    setCloudError(null);
    setUser(null);
  };

  const pushAllToCloud = async (): Promise<{ success: boolean; message: string }> => {
    setCloudStatus('syncing');
    const res = await pushLocalDataToCloud(transactions, budgets);
    if (res.success) {
      setCloudStatus('connected');
    } else {
      setCloudStatus('error');
      setCloudError(res.message);
    }
    return res;
  };

  const resetToDemoData = () => {
    const { transactions: demoTxs, budgets: demoBudgets, subscriptions: demoSubs } = resetToSampleData();
    setTransactions(demoTxs);
    setBudgets(demoBudgets);
    setSubscriptions(demoSubs);
    setActiveMonth(getCurrentMonth());

    if (cloudStatus === 'connected') {
      pushLocalDataToCloud(demoTxs, demoBudgets);
    }
  };

  const clearAllData = () => {
    clearAllStorage();
    setTransactions([]);
    setBudgets({});
    setSubscriptions([]);
    setQuickPresets([]);
  };

  const importData = (jsonString: string) => {
    const result = importDataFromJSON(jsonString);
    if (result.success) {
      const loadedTxs = loadStoredTransactions();
      const loadedBudgets = loadStoredBudgets();
      const loadedSubs = loadStoredSubscriptions();
      const loadedPresets = loadStoredPresets();
      setTransactions(loadedTxs);
      setBudgets(loadedBudgets);
      setSubscriptions(loadedSubs);
      setQuickPresets(loadedPresets);

      if (cloudStatus === 'connected') {
        pushLocalDataToCloud(loadedTxs, loadedBudgets);
      }
    }
    return result;
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        subscriptions,
        quickPresets,
        user,
        activeMonth,
        budgets,
        activeBudget,
        metrics,
        categoryBreakdown,
        monthlyComparison,
        activeMonthTransactions,
        cloudStatus,
        cloudConfig,
        cloudError,
        setActiveMonth,
        prevMonth,
        nextMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        addQuickPreset,
        updateQuickPreset,
        deleteQuickPreset,
        setMonthlyBudget,
        resetToDemoData,
        clearAllData,
        importData,
        connectCloud,
        disconnectCloud,
        syncWithCloud,
        pushAllToCloud,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
