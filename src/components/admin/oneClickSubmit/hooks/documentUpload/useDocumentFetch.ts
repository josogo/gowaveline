
import { useCallback } from 'react';
import { getMerchantDocuments } from '@/services/merchantApplicationService';
import { DocumentFile } from './types';

export const useDocumentFetch = (
  applicationId: string,
  setDocuments: (docs: DocumentFile[]) => void,
  setIsLoading: (loading: boolean) => void
) => {
  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      console.warn('Cannot load documents without applicationId');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Loading documents for application:', applicationId);
      const { data, error } = await getMerchantDocuments(applicationId);
      
      if (error) {
        console.error('Error loading documents:', error);
        throw error;
      }
      
      console.log(`Documents loaded: ${data?.length || 0} documents found`);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error in loadDocuments:', error);
      // Don't show toast here to avoid spamming the user
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, setDocuments, setIsLoading]);

  return {
    loadDocuments
  };
};
