import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Transaction,
  MonthlyMetrics,
  CategorySummary,
  MonthlyComparison,
} from '../types/finance';
import {
  loadStoredTransactions,
  saveStoredTransactions,
  loadStoredBudgets,
  saveStoredBudgets,
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
  type CloudConfig,
} from '../services/supabaseClient';
import {
  fetchCloudTransactions,
  fetchCloudBudgets,
  pushTransactionToCloud,
  updateCloudTransaction,
  deleteCloudTransaction,
  saveCloudBudget,
  pushLocalDataToCloud,
  subscribeToCloudRealtime,
} from '../services/cloudSync';

export type CloudStatus = 'connected' | 'connecting' | 'disconnected' | 'syncing' | 'error';

interface FinanceContextType {
  transactions: Transaction[];
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
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
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
      const [remoteTxs, remoteBudgets] = await Promise.all([
        fetchCloudTransactions(),
        fetchCloudBudgets(),
      ]);

      if (remoteTxs !== null) {
        if (remoteTxs.length > 0) {
          // Merge or replace: if cloud has data, use cloud data
          setTransactions(remoteTxs);
        } else if (transactions.length > 0) {
          // Cloud table is empty, push existing local transactions to cloud
          await pushLocalDataToCloud(transactions, budgets);
        }
      }

      if (remoteBudgets !== null && Object.keys(remoteBudgets).length > 0) {
        setBudgets(remoteBudgets);
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
        // Transactions changed in cloud
        const remoteTxs = await fetchCloudTransactions();
        if (remoteTxs) {
          setTransactions(remoteTxs);
        }
      },
      async () => {
        // Budgets changed in cloud
        const remoteBudgets = await fetchCloudBudgets();
        if (remoteBudgets) {
          setBudgets(remoteBudgets);
        }
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

  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
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
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    // 1. Instant local update
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );

    // 2. Async cloud update
    if (cloudStatus === 'connected') {
      updateCloudTransaction(id, data).catch((e) =>
        console.error('Background cloud update failed:', e)
      );
    }
  };

  const deleteTransaction = (id: string) => {
    // 1. Instant local update
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    // 2. Async cloud delete
    if (cloudStatus === 'connected') {
      deleteCloudTransaction(id).catch((e) =>
        console.error('Background cloud delete failed:', e)
      );
    }
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

    // Save and re-init
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
    const { transactions: demoTxs, budgets: demoBudgets } = resetToSampleData();
    setTransactions(demoTxs);
    setBudgets(demoBudgets);
    setActiveMonth(getCurrentMonth());

    if (cloudStatus === 'connected') {
      pushLocalDataToCloud(demoTxs, demoBudgets);
    }
  };

  const clearAllData = () => {
    clearAllStorage();
    setTransactions([]);
    setBudgets({});
  };

  const importData = (jsonString: string) => {
    const result = importDataFromJSON(jsonString);
    if (result.success) {
      const loadedTxs = loadStoredTransactions();
      const loadedBudgets = loadStoredBudgets();
      setTransactions(loadedTxs);
      setBudgets(loadedBudgets);

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
