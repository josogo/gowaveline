
import { useState, useCallback, useEffect } from 'react';
import { useDocumentFetch } from './useDocumentFetch';
import { useDocumentState } from './useDocumentState';
import { useDocumentUploader } from './useDocumentUploader';
import { DocumentFile, UploadDocumentOptions } from './types';

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
  const { loadDocuments } = useDocumentFetch(
    applicationId,
    setDocuments,
    setIsLoading
  );

  // Initialize document uploader
  const { uploadDocument } = useDocumentUploader(
    setUploading,
    setUploadProgress,
    setUploadError,
    loadDocuments
  );

  // Load documents when component initializes or applicationId changes
  useEffect(() => {
    if (applicationId) {
      console.log(`useDocumentUpload: Initial load for applicationId ${applicationId}`);
      loadDocuments();
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
