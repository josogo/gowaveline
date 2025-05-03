
import { useCallback, useEffect, useRef } from 'react';
import { useDocumentFetch } from './useDocumentFetch';
import { useDocumentState } from './useDocumentState';
import { useDocumentUploader } from './useDocumentUploader';
import { DocumentFile } from './types';

/**
 * Main hook for document upload functionality
 * Combines document state, upload, and fetching capabilities
 */
export const useDocumentUpload = (applicationId: string = '') => {
  // Keep the original applicationId reference
  const applicationIdRef = useRef(applicationId);
  // Track if the component is still mounted
  const isMountedRef = useRef(true);
  
  // Update the ref when applicationId changes
  useEffect(() => {
    applicationIdRef.current = applicationId;
  }, [applicationId]);
  
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
    // Skip if component unmounted
    if (!isMountedRef.current) return;
    
    const currentAppId = applicationIdRef.current;
    
    if (!currentAppId) {
      console.warn('[useDocumentUpload] Cannot load documents: No applicationId provided');
      return;
    }
    
    console.log(`[useDocumentUpload] Loading documents for applicationId: ${currentAppId}`);
    await fetchDocuments();
  }, [fetchDocuments]);

  // Initialize document uploader
  const { uploadDocument: upload } = useDocumentUploader(
    setUploading,
    setUploadProgress,
    setUploadError,
    loadDocuments
  );

  // Memoized upload function that validates applicationId
  const uploadDocument = useCallback((options: any) => {
    // Skip if component unmounted
    if (!isMountedRef.current) {
      console.log('[useDocumentUpload] Skipping upload as component is unmounted');
      return Promise.reject(new Error('Component unmounted'));
    }
    
    const currentAppId = applicationIdRef.current;
    
    if (!currentAppId && !options.applicationId) {
      console.error('[useDocumentUpload] Cannot upload: No applicationId provided');
      return Promise.reject(new Error('Application ID is required'));
    }
    
    // Make sure we're using the latest applicationId
    const effectiveOptions = {
      ...options,
      applicationId: options.applicationId || currentAppId
    };
    
    console.log('[useDocumentUpload] Uploading document with options:', 
      JSON.stringify({
        ...effectiveOptions,
        file: effectiveOptions.file ? `${effectiveOptions.file.name} (${effectiveOptions.file.size} bytes)` : 'No file'
      })
    );
    
    return upload(effectiveOptions);
  }, [upload, applicationIdRef]);

  // Load documents when component initializes or applicationId changes
  useEffect(() => {
    if (applicationId) {
      console.log(`[useDocumentUpload] Initial load for applicationId ${applicationId}`);
      loadDocuments().catch(err => {
        if (isMountedRef.current) {
          console.error('[useDocumentUpload] Error in initial document load:', err);
        }
      });
    } else {
      console.warn('[useDocumentUpload] No applicationId provided for initial load');
    }
    
    // Clean up function to ensure we don't have state updates after unmounting
    return () => {
      console.log('[useDocumentUpload] Cleaning up document upload resources');
      isMountedRef.current = false;
    };
  }, [applicationId, loadDocuments]);

  // Clean up state when unmounting to prevent memory leaks and state updates after unmount
  useEffect(() => {
    return () => {
      console.log('[useDocumentUpload] Unmounting document upload hook');
      isMountedRef.current = false;
      if (setUploading) setUploading(false);
      if (setUploadProgress) setUploadProgress(0);
      if (setUploadError) setUploadError(null);
      if (setIsLoading) setIsLoading(false);
    };
  }, [setUploading, setUploadProgress, setUploadError, setIsLoading]);

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
