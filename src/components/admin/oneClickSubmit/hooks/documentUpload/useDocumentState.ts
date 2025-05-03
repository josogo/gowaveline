
import { useState } from 'react';
import { DocumentFile } from './types';

/**
 * Hook for managing document state
 */
export const useDocumentState = () => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resetUploadState = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  };
  
  return {
    documents,
    uploading,
    uploadProgress,
    uploadError,
    isLoading,
    setDocuments,
    setUploading,
    setUploadProgress,
    setUploadError,
    resetUploadState,
    setIsLoading
  };
};
