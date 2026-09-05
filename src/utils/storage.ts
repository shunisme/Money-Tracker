import type { Transaction, Subscription } from '../types/finance';
import { getCurrentMonth, shiftMonth } from './formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'moneytrack_transactions_v1',
  BUDGETS: 'moneytrack_budgets_v1',
  SUBSCRIPTIONS: 'moneytrack_subscriptions_v1',
  THEME: 'moneytrack_theme_v1',
  INITIALIZED: 'moneytrack_has_initialized_v1',
};

/**
 * Generate realistic Malaysian sample transactions for current and previous months
 */
export const generateSampleTransactions = (): Transaction[] => {
  const currentMonth = getCurrentMonth();
  const prev1Month = shiftMonth(currentMonth, -1);
  const prev2Month = shiftMonth(currentMonth, -2);
  const prev3Month = shiftMonth(currentMonth, -3);
  const prev4Month = shiftMonth(currentMonth, -4);
  const prev5Month = shiftMonth(currentMonth, -5);

  let idCounter = 1;
  const createTx = (
    date: string,
    amount: number,
    type: 'income' | 'expense',
    category: any,
    description: string
  ): Transaction => ({
    id: `sample-tx-${idCounter++}`,
    amount,
    type,
    category,
    description,
    date,
    createdAt: new Date(`${date}T10:00:00`).toISOString(),
  });

  const txs: Transaction[] = [
    // Current Month Transactions (e.g. current month)
    createTx(`${currentMonth}-01`, 5800, 'income', 'Salary', 'Monthly Tech Lead Salary (Direct Credit)'),
    createTx(`${currentMonth}-02`, 750, 'income', 'Freelance', 'UI/UX Design Consultation for SME client'),
    createTx(`${currentMonth}-02`, 180, 'expense', 'Bills', 'Maxis Postpaid & Home Fibre'),
    createTx(`${currentMonth}-03`, 28.50, 'expense', 'Food', 'Village Park Nasi Lemak & Kopi C'),
    createTx(`${currentMonth}-03`, 120, 'expense', 'Transport', 'Petronas Primax 97 Petrol & TnG reload'),
    createTx(`${currentMonth}-04`, 265.40, 'expense', 'Food', 'Jaya Grocer Weekly Groceries & Fresh Produce'),
    createTx(`${currentMonth}-05`, 45, 'expense', 'Entertainment', 'GSC Cinemas Tickets (Deadpool & Wolverine)'),
    createTx(`${currentMonth}-06`, 149, 'expense', 'Shopping', 'Uniqlo AIRism Oversized Tees & Pants'),
    createTx(`${currentMonth}-07`, 85, 'expense', 'Health', 'Guardian Pharmacy Vitamins & Dental Care'),
    createTx(`${currentMonth}-08`, 36, 'expense', 'Food', 'Subang Jaya SS15 Hawker Kopitiam Dinner'),
    createTx(`${currentMonth}-09`, 210, 'expense', 'Bills', 'TNB Electricity Bill (Aircond usage)'),
    createTx(`${currentMonth}-10`, 35, 'expense', 'Transport', 'GrabCar ride to KL Sentral meeting'),
    createTx(`${currentMonth}-11`, 89, 'expense', 'Education', 'O\'Reilly Tech Book & Udemy Python Course'),
    createTx(`${currentMonth}-12`, 320, 'income', 'Investment', 'Versa Cash & StashAway Monthly Yield'),
    createTx(`${currentMonth}-13`, 42, 'expense', 'Food', 'Mamak Roti Canai & Teh Tarik supper'),
    createTx(`${currentMonth}-14`, 380, 'expense', 'Shopping', 'Keychron Mechanical Keyboard (Shopee Mall)'),

    // Previous Month 1 Transactions
    createTx(`${prev1Month}-01`, 5800, 'income', 'Salary', 'Monthly Tech Lead Salary (Direct Credit)'),
    createTx(`${prev1Month}-04`, 900, 'income', 'Freelance', 'Fullstack React Dashboard milestone payout'),
    createTx(`${prev1Month}-02`, 180, 'expense', 'Bills', 'Maxis Postpaid & Home Fibre'),
    createTx(`${prev1Month}-03`, 195, 'expense', 'Bills', 'TNB Electricity Bill'),
    createTx(`${prev1Month}-05`, 340, 'expense', 'Food', 'Ben\'s Independent Grocer bulk shopping'),
    createTx(`${prev1Month}-07`, 110, 'expense', 'Transport', 'Shell V-Power Petrol refill'),
    createTx(`${prev1Month}-10`, 220, 'expense', 'Shopping', 'Decathlon Gym gear & running shoes'),
    createTx(`${prev1Month}-12`, 160, 'expense', 'Health', 'Dental scaling & clinic consultation'),
    createTx(`${prev1Month}-15`, 54, 'expense', 'Entertainment', 'Netflix & Spotify Family Premium'),
    createTx(`${prev1Month}-18`, 350, 'expense', 'Food', 'Family Dinner at Din Tai Fung Mid Valley'),
    createTx(`${prev1Month}-20`, 80, 'expense', 'Transport', 'Touch \'n Go RFID toll reload'),
    createTx(`${prev1Month}-22`, 120, 'expense', 'Education', 'Frontend Masters Annual Subscription Share'),
    createTx(`${prev1Month}-25`, 78, 'expense', 'Food', 'Sunday Brunch at Kenny Hills Bakers'),
    createTx(`${prev1Month}-28`, 45, 'expense', 'Other', 'Car wash and tire pressure check'),

    // Previous Month 2 Transactions
    createTx(`${prev2Month}-01`, 5800, 'income', 'Salary', 'Monthly Tech Lead Salary'),
    createTx(`${prev2Month}-03`, 500, 'income', 'Allowance', 'Quarterly festive family allowance'),
    createTx(`${prev2Month}-02`, 180, 'expense', 'Bills', 'Maxis Fibre Internet'),
    createTx(`${prev2Month}-05`, 280, 'expense', 'Food', 'Lotus\'s Hypermarket pantry restock'),
    createTx(`${prev2Month}-08`, 130, 'expense', 'Transport', 'Petronas Petrol'),
    createTx(`${prev2Month}-11`, 450, 'expense', 'Shopping', 'Sony WH-CH720N Noise Cancelling Headphones'),
    createTx(`${prev2Month}-14`, 95, 'expense', 'Entertainment', 'Board games night & snacks'),
    createTx(`${prev2Month}-17`, 150, 'expense', 'Food', 'BBQ Steamboat dinner with colleagues'),
    createTx(`${prev2Month}-21`, 60, 'expense', 'Health', 'Pharmacy cold & allergy medication'),
    createTx(`${prev2Month}-25`, 50, 'expense', 'Transport', 'MRT monthly pass reload'),

    // Previous Month 3 Transactions
    createTx(`${prev3Month}-01`, 5800, 'income', 'Salary', 'Monthly Tech Lead Salary'),
    createTx(`${prev3Month}-05`, 1200, 'income', 'Freelance', 'Mobile App Prototype project completion'),
    createTx(`${prev3Month}-03`, 210, 'expense', 'Bills', 'TNB Electricity'),
    createTx(`${prev3Month}-07`, 410, 'expense', 'Food', 'Groceries & Dining out'),
    createTx(`${prev3Month}-12`, 140, 'expense', 'Transport', 'Touch \'n Go & Petrol'),
    createTx(`${prev3Month}-18`, 300, 'expense', 'Shopping', 'Mid-year clothing sale'),
    createTx(`${prev3Month}-22`, 90, 'expense', 'Entertainment', 'Laser tag & bowling weekend'),

    // Previous Month 4 Transactions
    createTx(`${prev4Month}-01`, 5800, 'income', 'Salary', 'Monthly Tech Lead Salary'),
    createTx(`${prev4Month}-04`, 250, 'income', 'Investment', 'Dividend payout Maybank Shares'),
    createTx(`${prev4Month}-05`, 180, 'expense', 'Bills', 'Utilities & Internet'),
    createTx(`${prev4Month}-09`, 380, 'expense', 'Food', 'Groceries'),
    createTx(`${prev4Month}-15`, 120, 'expense', 'Transport', 'Fuel & tolls'),
    createTx(`${prev4Month}-20`, 180, 'expense', 'Shopping', 'Home improvement tools'),

    // Previous Month 5 Transactions
    createTx(`${prev5Month}-01`, 5800, 'income', 'Salary', 'Monthly Tech Lead Salary'),
    createTx(`${prev5Month}-06`, 220, 'expense', 'Bills', 'Electric & water'),
    createTx(`${prev5Month}-10`, 390, 'expense', 'Food', 'Groceries & coffee'),
    createTx(`${prev5Month}-16`, 110, 'expense', 'Transport', 'Petrol fuel'),
    createTx(`${prev5Month}-24`, 150, 'expense', 'Entertainment', 'Theme park day trip'),
  ];

  return txs;
};

export const getDefaultBudgets = (): Record<string, number> => {
  const currentMonth = getCurrentMonth();
  const budgets: Record<string, number> = {};
  for (let i = 0; i < 6; i++) {
    budgets[shiftMonth(currentMonth, -i)] = 3200;
  }
  return budgets;
};

/**
 * Load transactions from localStorage or initialize with sample data
 */
export const loadStoredTransactions = (): Transaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const hasInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

    if (!raw && !hasInitialized) {
      const samples = generateSampleTransactions();
      saveStoredTransactions(samples);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return samples;
    }

    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load transactions from localStorage:', err);
    return [];
  }
};

/**
 * Save transactions to localStorage
 */
export const saveStoredTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage:', err);
  }
};

/**
 * Load budgets from localStorage or default
 */
export const loadStoredBudgets = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      const defaultBudgets = getDefaultBudgets();
      saveStoredBudgets(defaultBudgets);
      return defaultBudgets;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load budgets from localStorage:', err);
    return getDefaultBudgets();
  }
};

/**
 * Save budgets to localStorage
 */
export const saveStoredBudgets = (budgets: Record<string, number>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error('Failed to save budgets to localStorage:', err);
  }
};

/**
 * Generate realistic Malaysian sample recurring subscriptions
 */
export const generateSampleSubscriptions = (): Subscription[] => [
  {
    id: 'sub-1',
    name: 'Netflix Premium (4K HDR)',
    amount: 54.90,
    billingCycle: 'monthly',
    billingDay: 15,
    category: 'Entertainment',
    autoRenew: true,
    notes: 'Family 4-screen plan',
  },
  {
    id: 'sub-2',
    name: 'Spotify Premium Family',
    amount: 24.90,
    billingCycle: 'monthly',
    billingDay: 28,
    category: 'Entertainment',
    autoRenew: true,
  },
  {
    id: 'sub-3',
    name: 'Maxis Home Fibre 300Mbps',
    amount: 139.00,
    billingCycle: 'monthly',
    billingDay: 2,
    category: 'Bills',
    autoRenew: true,
    notes: 'Auto-debit from card',
  },
  {
    id: 'sub-4',
    name: 'Celebrity Fitness All-Club Gym',
    amount: 165.00,
    billingCycle: 'monthly',
    billingDay: 5,
    category: 'Health',
    autoRenew: true,
  },
  {
    id: 'sub-5',
    name: 'iCloud+ 200GB Storage',
    amount: 11.90,
    billingCycle: 'monthly',
    billingDay: 19,
    category: 'Bills',
    autoRenew: true,
  },
];

/**
 * Load subscriptions from localStorage
 */
export const loadStoredSubscriptions = (): Subscription[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) {
      const sample = generateSampleSubscriptions();
      saveStoredSubscriptions(sample);
      return sample;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load subscriptions from localStorage:', err);
    return generateSampleSubscriptions();
  }
};

/**
 * Save subscriptions to localStorage
 */
export const saveStoredSubscriptions = (subs: Subscription[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  } catch (err) {
    console.error('Failed to save subscriptions to localStorage:', err);
  }
};

/**
 * Clear all MoneyTrack data from localStorage
 */
export const clearAllStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
};

/**
 * Reset to rich sample data
 */
export const resetToSampleData = (): {
  transactions: Transaction[];
  budgets: Record<string, number>;
  subscriptions: Subscription[];
} => {
  const transactions = generateSampleTransactions();
  const budgets = getDefaultBudgets();
  const subscriptions = generateSampleSubscriptions();
  saveStoredTransactions(transactions);
  saveStoredBudgets(budgets);
  saveStoredSubscriptions(subscriptions);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  return { transactions, budgets, subscriptions };
};

/**
 * Export data to a downloadable JSON string
 */
export const exportDataAsJSON = (): string => {
  const transactions = loadStoredTransactions();
  const budgets = loadStoredBudgets();
  const subscriptions = loadStoredSubscriptions();
  return JSON.stringify(
    {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      transactions,
      budgets,
      subscriptions,
    },
    null,
    2
  );
};

/**
 * Import data from parsed JSON
 */
export const importDataFromJSON = (
  jsonString: string
): { success: boolean; message: string; count?: number } => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.transactions)) {
      return { success: false, message: 'Invalid format: transactions array missing.' };
    }

    saveStoredTransactions(parsed.transactions);
    if (parsed.budgets && typeof parsed.budgets === 'object') {
      saveStoredBudgets(parsed.budgets);
    }
    if (Array.isArray(parsed.subscriptions)) {
      saveStoredSubscriptions(parsed.subscriptions);
    }

    return {
      success: true,
      message: `Successfully imported ${parsed.transactions.length} transactions and ${
        parsed.subscriptions?.length || 0
      } subscriptions!`,
      count: parsed.transactions.length,
    };
  } catch (err: any) {
    return { success: false, message: `Failed to import JSON: ${err.message}` };
  }
};
