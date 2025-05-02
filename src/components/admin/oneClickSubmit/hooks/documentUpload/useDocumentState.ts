
import { useState, useCallback } from 'react';
import { DocumentFile } from './types';

export const useDocumentState = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resetUploadState = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  }, []);
  
  return {
    // Upload states
    uploading,
    setUploading,
    uploadProgress,
    setUploadProgress,
    uploadError,
    setUploadError,
    resetUploadState,
    
    // Documents state
    documents,
    setDocuments,
    isLoading,
    setIsLoading
  };
};
