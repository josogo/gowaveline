
import { supabase } from '@/integrations/supabase/client';

export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'admin'
    });

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return !!data;
  } catch (e) {
    console.error('Exception checking admin role:', e);
    return false;
  }
}
