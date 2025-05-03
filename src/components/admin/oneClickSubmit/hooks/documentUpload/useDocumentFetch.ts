
import { useCallback } from 'react';
import { fetchMerchantDocuments } from '@/services/merchantApplicationService';
import { DocumentFile } from './types';

/**
 * Hook for fetching document data
 */
export const useDocumentFetch = (
  applicationId: string,
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      console.warn('[useDocumentFetch] Cannot load documents: No application ID provided');
      return Promise.resolve([]);
    }
    
    console.log(`[useDocumentFetch] Loading documents for application: ${applicationId}`);
    setIsLoading(true);
    
    try {
      const { data, error } = await fetchMerchantDocuments(applicationId);
      
      if (error) {
        console.error('[useDocumentFetch] Error fetching documents:', error);
        setIsLoading(false);
        return Promise.reject(error);
      }
      
      console.log('[useDocumentFetch] Documents loaded:', data?.length || 0);
      
      if (data) {
        setDocuments(data);
      }
      
      setIsLoading(false);
      return Promise.resolve(data || []);
    } catch (err) {
      console.error('[useDocumentFetch] Exception fetching documents:', err);
      setIsLoading(false);
      return Promise.reject(err);
    }
  }, [applicationId, setDocuments, setIsLoading]);
  
  return { loadDocuments };
};
