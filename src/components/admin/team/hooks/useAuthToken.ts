
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthToken = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthToken(session?.access_token || null);
      } catch (error) {
        console.error("Error retrieving auth session:", error);
      }
    };
    
    checkAuthSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthToken(session?.access_token || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authToken;
};
