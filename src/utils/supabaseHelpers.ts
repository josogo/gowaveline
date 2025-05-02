
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'] | keyof Database['public']['Views'];

/**
 * Helper function to handle Supabase queries with proper typing
 * This is a workaround for TypeScript errors when Supabase client types are not fully defined
 */
export const typedQuery = {
  from: <T = any>(table: string) => {
    return {
      select: (columns: string = '*') => {
        return supabase.from(table as any).select(columns) as any;
      },
      insert: (data: Partial<T>) => {
        return supabase.from(table as any).insert(data as any) as any;
      },
      update: (data: Partial<T>) => {
        return supabase.from(table as any).update(data as any) as any;
      },
      delete: () => {
        return supabase.from(table as any).delete() as any;
      }
    };
  }
};

/**
 * Alternative approach: Cast Supabase client to any to bypass TypeScript errors
 * Use this with caution as it bypasses type checking
 */
export const anySupabase = supabase as any;
