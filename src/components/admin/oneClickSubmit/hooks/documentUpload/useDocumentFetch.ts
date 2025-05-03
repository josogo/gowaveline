
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
      console.warn('No applicationId provided for document fetch');
      setDocuments([]);
      return;
    }
    
    console.log(`Loading documents for applicationId: ${applicationId}`);
    setIsLoading(true);
    
    try {
      const { data, error } = await getMerchantDocuments(applicationId);
      
      if (error) {
        console.error('Error loading documents:', error);
        toast.error(`Error loading documents: ${error.message}`);
        setDocuments([]);
      } else {
        console.log(`Loaded ${data?.length || 0} documents for applicationId: ${applicationId}`);
        setDocuments(data || []);
      }
    } catch (err: any) {
      console.error('Exception in loadDocuments:', err);
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
