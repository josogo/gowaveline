
import { useState, useEffect } from 'react';
import { useDocumentState } from './useDocumentState';
import { useDocumentFetch } from './useDocumentFetch';
import { useDocumentUploader } from './useDocumentUploader';
import { UploadDocumentOptions } from './types';

export const useDocumentUpload = (applicationId: string) => {
  const {
    uploading, setUploading,
    uploadProgress, setUploadProgress,
    uploadError, setUploadError,
    resetUploadState,
    documents, setDocuments,
    isLoading, setIsLoading
  } = useDocumentState();

  const { loadDocuments } = useDocumentFetch(applicationId, setDocuments, setIsLoading);
  
  const { uploadDocument } = useDocumentUploader(
    setUploading,
    setUploadProgress,
    setUploadError,
    loadDocuments
  );
  
  // Load documents on initial mount
  useEffect(() => {
    if (applicationId) {
      loadDocuments().catch(err => console.error('Initial document load failed:', err));
    }
  }, [applicationId, loadDocuments]);
  
  return {
    uploading,
    uploadProgress,
    uploadError,
    documents,
    isLoading,
    uploadDocument,
    loadDocuments,
    resetUploadState
  };
};

export type { UploadDocumentOptions } from './types';
export type { DocumentFile } from './types';
