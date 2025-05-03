
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile } from './types';

/**
 * Hook for fetching documents from the database
 */
export const useDocumentFetch = (
  applicationId: string,
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      console.warn('[useDocumentFetch] No applicationId provided');
      return Promise.reject(new Error('Application ID is required'));
    }
    
    setIsLoading(true);
    
    try {
      console.log(`[useDocumentFetch] Loading documents for application: ${applicationId}`);
      
      // First try using the edge function
      try {
        console.log('[useDocumentFetch] Trying edge function');
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        
        if (!token) {
          console.warn('[useDocumentFetch] No auth token available');
          throw new Error('Authentication required');
        }
        
        const response = await fetch(
          `https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/get-merchant-documents?applicationId=${applicationId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Edge function error: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('[useDocumentFetch] Documents loaded via edge function:', result);
        
        if (result.documents) {
          setDocuments(result.documents);
          return result.documents;
        }
      } catch (edgeFunctionError) {
        console.warn('[useDocumentFetch] Edge function failed, trying direct query:', edgeFunctionError);
        
        // Fall back to direct query
        const { data, error } = await supabase
          .from('merchant_documents')
          .select('*')
          .eq('merchant_id', applicationId)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        console.log('[useDocumentFetch] Documents loaded via direct query:', data);
        setDocuments(data || []);
        return data;
      }
      
      return [];
    } catch (error: any) {
      console.error('[useDocumentFetch] Error loading documents:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, setDocuments, setIsLoading]);
  
  return { loadDocuments };
};
