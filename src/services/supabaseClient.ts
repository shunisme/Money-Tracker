import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';

const CONFIG_KEY = 'moneytrack_supabase_config_v1';

export interface CloudConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

let cachedClient: SupabaseClient | null = null;
let currentConfigSignature = '';

/**
 * Retrieve current Supabase cloud configuration from env or localStorage
 */
export const getCloudConfig = (): CloudConfig => {
  // Check env first
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      isConfigured: true,
    };
  }

  // Fallback to localStorage configuration
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          isConfigured: true,
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse cloud config from localStorage:', err);
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
  };
};

/**
 * Persist cloud configuration to localStorage
 */
export const saveCloudConfig = (url: string, anonKey: string): void => {
  const config = { url: url.trim(), anonKey: anonKey.trim() };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  cachedClient = null; // reset cached client
  currentConfigSignature = '';
};

/**
 * Clear cloud configuration
 */
export const clearCloudConfig = (): void => {
  localStorage.removeItem(CONFIG_KEY);
  cachedClient = null;
  currentConfigSignature = '';
};

/**
 * Get or initialize the Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getCloudConfig();
  if (!config.isConfigured) {
    return null;
  }

  const sig = `${config.url}::${config.anonKey}`;
  if (cachedClient && currentConfigSignature === sig) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentConfigSignature = sig;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

/**
 * Test connectivity with Supabase database
 */
export const testCloudConnection = async (
  urlOverride?: string,
  keyOverride?: string
): Promise<{ success: boolean; message: string }> => {
  let client: SupabaseClient | null = null;

  if (urlOverride && keyOverride) {
    try {
      client = createClient(urlOverride.trim(), keyOverride.trim());
    } catch (err: any) {
      return { success: false, message: `Invalid URL or Key format: ${err.message}` };
    }
  } else {
    client = getSupabaseClient();
  }

  if (!client) {
    return { success: false, message: 'Supabase is not configured yet.' };
  }

  try {
    // Attempt a light query to test both connectivity and RLS policy permissions
    const { error } = await client.from('transactions').select('id', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message:
            'Connected to Supabase, but "transactions" table not found! Please run the schema.sql in Supabase SQL Editor.',
        };
      }
      return { success: false, message: `Database error (${error.code}): ${error.message}` };
    }

    return {
      success: true,
      message: 'Connection successful! Cloud database is connected and accessible.',
    };
  } catch (err: any) {
    return { success: false, message: `Network/Connection error: ${err.message}` };
  }
};

/**
 * Sign up a new user with Email and Password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured yet.');
  return await client.auth.signUp({ email, password });
};

/**
 * Sign in existing user with Email and Password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured yet.');
  return await client.auth.signInWithPassword({ email, password });
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  const client = getSupabaseClient();
  if (!client) return;
  return await client.auth.signOut();
};

/**
 * Get current session user
 */
export const getAuthUser = async (): Promise<User | null> => {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data?.user || null;
};

