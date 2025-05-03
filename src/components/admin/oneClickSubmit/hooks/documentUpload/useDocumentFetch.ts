
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for fetching documents from storage or localStorage for temporary docs
 */
export const useDocumentFetch = (
  applicationId: string,
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setDocuments([]);

    try {
      // Check if this is a temporary upload session
      const isTemporary = applicationId.startsWith('temp_');

      if (isTemporary) {
        // Fetch from localStorage for temp documents
        const tempUploadsKey = `temp_documents_${applicationId}`;
        const tempDocs = JSON.parse(localStorage.getItem(tempUploadsKey) || '[]');
        console.log(`[useDocumentFetch] Loaded ${tempDocs.length} temp documents from localStorage`);
        setDocuments(tempDocs);
        return tempDocs;
      } else {
        // Fetch from database for real application documents
        const { data, error } = await supabase
          .from('merchant_documents')
          .select('*')
          .eq('merchant_id', applicationId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[useDocumentFetch] Error fetching documents:', error);
          throw error;
        }

        console.log(`[useDocumentFetch] Fetched ${data?.length || 0} documents from database`);
        setDocuments(data || []);
        return data;
      }
    } catch (error) {
      console.error('[useDocumentFetch] Exception in loadDocuments:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, setDocuments, setIsLoading]);

  return { loadDocuments };
};
