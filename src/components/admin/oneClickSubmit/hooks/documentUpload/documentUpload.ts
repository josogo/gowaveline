
import { useCallback, useEffect } from 'react';
import { useDocumentFetch } from './useDocumentFetch';
import { useDocumentState } from './useDocumentState';
import { useDocumentUploader } from './useDocumentUploader';
import { DocumentFile } from './types';

/**
 * Main hook for document upload functionality
 * Combines document state, upload, and fetching capabilities
 */
export const useDocumentUpload = (applicationId: string = '') => {
  // Initialize document state
  const {
    documents,
    uploading,
    uploadProgress,
    uploadError,
    setDocuments,
    setUploading,
    setUploadProgress,
    setUploadError,
    resetUploadState,
    isLoading,
    setIsLoading
  } = useDocumentState();

  // Initialize document fetching
  const { loadDocuments: fetchDocuments } = useDocumentFetch(
    applicationId,
    setDocuments,
    setIsLoading
  );

  // Create a memoized loadDocuments function that validates the applicationId
  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      console.warn('[useDocumentUpload] Cannot load documents: No applicationId provided');
      return;
    }
    
    console.log(`[useDocumentUpload] Loading documents for applicationId: ${applicationId}`);
    await fetchDocuments();
  }, [applicationId, fetchDocuments]);

  // Initialize document uploader
  const { uploadDocument: upload } = useDocumentUploader(
    setUploading,
    setUploadProgress,
    setUploadError,
    loadDocuments
  );

  // Memoized upload function that validates applicationId
  const uploadDocument = useCallback((options: any) => {
    if (!applicationId && !options.applicationId) {
      console.error('[useDocumentUpload] Cannot upload: No applicationId provided');
      return Promise.reject(new Error('Application ID is required'));
    }
    
    // Make sure we're using the latest applicationId
    const effectiveOptions = {
      ...options,
      applicationId: options.applicationId || applicationId
    };
    
    return upload(effectiveOptions);
  }, [upload, applicationId]);

  // Load documents when component initializes or applicationId changes
  useEffect(() => {
    if (applicationId) {
      console.log(`[useDocumentUpload] Initial load for applicationId ${applicationId}`);
      loadDocuments();
    } else {
      console.warn('[useDocumentUpload] No applicationId provided for initial load');
    }
  }, [applicationId, loadDocuments]);

  return {
    // Document state
    documents,
    uploading,
    uploadProgress,
    uploadError,
    isLoading,

    // Actions
    uploadDocument,
    loadDocuments,
    resetUploadState,
  };
};
