
import { supabase } from '@/integrations/supabase/client';

interface Industry {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export async function fetchIndustries(): Promise<Industry[]> {
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }

  return data as Industry[];
}
