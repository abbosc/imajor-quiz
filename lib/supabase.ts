import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser client for client-side usage (with auth support)
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Alias for backward compatibility
export const createClient = () => supabase;
