
import { useCallback } from 'react';
import { toast } from 'sonner';
import { getMerchantDocuments } from '@/services/merchantApplicationService';
import { DocumentFile } from './types';

/**
 * Hook for fetching document data from the backend
 */
export const useDocumentFetch = (
  applicationId: string,
  setDocuments: (documents: DocumentFile[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  /**
   * Load documents for a specific application
   */
  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      console.warn('[useDocumentFetch] No applicationId provided for document fetch');
      setDocuments([]);
      setIsLoading(false);
      return;
    }
    
    console.log(`[useDocumentFetch] Loading documents for applicationId: ${applicationId}`);
    setIsLoading(true);
    
    try {
      const { data, error } = await getMerchantDocuments(applicationId);
      
      if (error) {
        console.error('[useDocumentFetch] Error loading documents:', error);
        toast.error(`Error loading documents: ${error.message}`);
        setDocuments([]);
      } else {
        console.log(`[useDocumentFetch] Loaded ${data?.length || 0} documents for applicationId: ${applicationId}`);
        setDocuments(data || []);
      }
    } catch (err: any) {
      console.error('[useDocumentFetch] Exception in loadDocuments:', err);
      toast.error(`Failed to load documents: ${err.message}`);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, setDocuments, setIsLoading]);
  
  return {
    loadDocuments
  };
};
