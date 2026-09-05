import type { Transaction } from '../types/finance';
import { getSupabaseClient } from './supabaseClient';

/**
 * Fetch all transactions from the cloud database
 */
export const fetchCloudTransactions = async (): Promise<Transaction[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Failed to fetch cloud transactions:', error);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: row.date,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Error fetching cloud transactions:', err);
    return null;
  }
};

/**
 * Insert or upsert a transaction in the cloud
 */
export const pushTransactionToCloud = async (tx: Transaction): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('transactions').upsert({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      date: tx.date,
      created_at: tx.createdAt || new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to push transaction to cloud:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error pushing transaction to cloud:', err);
    return false;
  }
};

/**
 * Update an existing transaction in the cloud
 */
export const updateCloudTransaction = async (
  id: string,
  data: Partial<Transaction>
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload: any = {};
    if (data.amount !== undefined) payload.amount = data.amount;
    if (data.type !== undefined) payload.type = data.type;
    if (data.category !== undefined) payload.category = data.category;
    if (data.description !== undefined) payload.description = data.description;
    if (data.date !== undefined) payload.date = data.date;

    const { error } = await client.from('transactions').update(payload).eq('id', id);

    if (error) {
      console.error('Failed to update cloud transaction:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error updating cloud transaction:', err);
    return false;
  }
};

/**
 * Delete a transaction from the cloud
 */
export const deleteCloudTransaction = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('transactions').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete cloud transaction:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting cloud transaction:', err);
    return false;
  }
};

/**
 * Fetch all budgets from the cloud
 */
export const fetchCloudBudgets = async (): Promise<Record<string, number> | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('budgets').select('*');
    if (error) {
      console.error('Failed to fetch cloud budgets:', error);
      return null;
    }

    const budgets: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      budgets[row.month] = parseFloat(row.amount);
    });
    return budgets;
  } catch (err) {
    console.error('Error fetching cloud budgets:', err);
    return null;
  }
};

/**
 * Upsert a budget target in the cloud
 */
export const saveCloudBudget = async (month: string, amount: number): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('budgets').upsert({
      month,
      amount,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to save cloud budget:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error saving cloud budget:', err);
    return false;
  }
};

/**
 * Bulk upload all local transactions and budgets to cloud
 */
export const pushLocalDataToCloud = async (
  transactions: Transaction[],
  budgets: Record<string, number>
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Cloud database is not configured.' };
  }

  try {
    // 1. Upload transactions in chunks of 50
    if (transactions.length > 0) {
      const payload = transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        category: t.category,
        description: t.description,
        date: t.date,
        created_at: t.createdAt || new Date().toISOString(),
      }));

      const chunkSize = 50;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        const { error } = await client.from('transactions').upsert(chunk);
        if (error) throw error;
      }
    }

    // 2. Upload budgets
    const budgetEntries = Object.entries(budgets);
    if (budgetEntries.length > 0) {
      const budgetPayload = budgetEntries.map(([month, amount]) => ({
        month,
        amount,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await client.from('budgets').upsert(budgetPayload);
      if (error) throw error;
    }

    return {
      success: true,
      message: `Successfully synchronized ${transactions.length} transactions and ${budgetEntries.length} budgets with Cloud!`,
    };
  } catch (err: any) {
    console.error('Error during bulk push to cloud:', err);
    return { success: false, message: `Failed to push data: ${err.message}` };
  }
};

/**
 * Subscribe to realtime changes on Supabase
 */
export const subscribeToCloudRealtime = (
  onTransactionsChange: () => void,
  onBudgetsChange: () => void
): (() => void) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel('moneytrack_realtime_sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'transactions' },
      () => {
        onTransactionsChange();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'budgets' },
      () => {
        onBudgetsChange();
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
