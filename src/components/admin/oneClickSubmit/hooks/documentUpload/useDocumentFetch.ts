
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile } from './types';
import { anySupabase } from '@/utils/supabaseHelpers';
import { useAuthToken } from '@/components/admin/team/hooks/useAuthToken';

/**
 * Hook for fetching document data from Supabase
 */
export const useDocumentFetch = (
  applicationId: string,
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[] | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const authToken = useAuthToken();
  
  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      console.warn('[useDocumentFetch] Cannot load documents without an applicationId');
      setDocuments(null);
      return;
    }
    
    setIsLoading(true);
    setFetchError(null);
    
    try {
      console.log(`[useDocumentFetch] Loading documents for applicationId: ${applicationId}`);
      
      // Get the user's auth status first
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session;
      
      // Try the standard query first
      let documents;
      
      try {
        // First try with RLS
        const { data, error } = await supabase
          .from('merchant_documents')
          .select('*')
          .eq('merchant_id', applicationId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        documents = data;
      } catch (queryError: any) {
        console.warn(`[useDocumentFetch] Standard query failed: ${queryError.message}`);
        
        // If authenticated, try fallback with service role
        if (isAuthenticated && authToken) {
          try {
            // Attempt to use edge function with auth
            const response = await fetch(`https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/get-merchant-documents?applicationId=${applicationId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Edge function error: ${response.statusText}`);
            }
            
            const result = await response.json();
            documents = result.documents;
          } catch (fallbackError: any) {
            console.error(`[useDocumentFetch] Fallback fetch failed: ${fallbackError.message}`);
            throw fallbackError;
          }
        } else {
          // Try one last fallback with anySupabase helper
          try {
            const { data: fallbackData } = await anySupabase
              .from('merchant_documents')
              .select('*')
              .eq('merchant_id', applicationId)
              .order('created_at', { ascending: false });
              
            documents = fallbackData;
          } catch (finalError: any) {
            console.error(`[useDocumentFetch] Final fetch attempt failed: ${finalError.message}`);
            throw finalError;
          }
        }
      }
      
      console.log(`[useDocumentFetch] Loaded ${documents?.length || 0} documents for applicationId: ${applicationId}`);
      setDocuments(documents || []);
    } catch (error: any) {
      console.error('[useDocumentFetch] Error:', error);
      setFetchError(error);
      setDocuments(null);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, setDocuments, setIsLoading, authToken]);
  
  return {
    loadDocuments,
    fetchError,
  };
};
