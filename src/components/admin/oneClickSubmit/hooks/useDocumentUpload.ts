
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getMerchantDocuments, uploadMerchantDocument } from '@/services/merchantApplicationService';

interface UploadDocumentOptions {
  file: File;
  applicationId?: string;
  documentType?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDocumentUpload = (applicationId: string) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resetUploadState = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  }, []);
  
  const uploadDocument = async ({
    file,
    documentType = 'other',
    onSuccess,
    onError
  }: UploadDocumentOptions) => {
    // Validate inputs
    if (!file) {
      const error = new Error('Please select a file to upload');
      toast.error(error.message);
      if (onError) onError(error);
      return;
    }
    
    if (!applicationId) {
      console.warn('No applicationId provided for document upload');
    }
    
    // Reset any previous errors and set initial state
    setUploadError(null);
    setUploading(true);
    setUploadProgress(10);
    
    console.log(`Starting upload with applicationId: ${applicationId}, documentType: ${documentType}, file: ${file.name}`);
    
    try {
      // Check if storage bucket exists, create if not
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw new Error(`Failed to list buckets: ${bucketsError.message}`);
      }
      
      const documentsBucketExists = buckets?.some(bucket => bucket.name === 'merchant-documents');
      
      if (!documentsBucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('merchant-documents', {
          public: true,
        });
        
        if (createBucketError) {
          throw new Error(`Failed to create bucket: ${createBucketError.message}`);
        }
        
        console.log('Created merchant-documents bucket');
      }
      
      setUploadProgress(20);
      
      // Use a unique ID if no applicationId is provided
      const effectiveAppId = applicationId || `temp-${new Date().getTime()}`;
      
      // Upload file to storage with simulated progress
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${effectiveAppId}/${documentType || 'other'}_${timestamp}.${fileExt}`;
      
      setUploadProgress(30);
      
      // Use a more reliable progress tracking approach
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 5, 85);
          return newProgress;
        });
      }, 300);
      
      console.log('Uploading file to path:', filePath);
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('merchant-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });
      
      clearInterval(progressInterval);
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        setUploadProgress(0);
        setUploadError(new Error(`Storage upload failed: ${uploadError.message}`));
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log('File uploaded successfully to storage:', fileData);
      setUploadProgress(90);
      
      // Create document record in database
      const { error: dbError } = await uploadMerchantDocument({
        applicationId: effectiveAppId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath,
        documentType: documentType || 'other'
      });
      
      if (dbError) {
        console.error('Database entry error:', dbError);
        setUploadError(new Error(`Database entry failed: ${dbError.message}`));
        throw new Error(`Database entry failed: ${dbError.message}`);
      }
      
      setUploadProgress(100);
      toast.success('Document uploaded successfully');
      
      // Refresh document list
      await loadDocuments();
      
      if (onSuccess) {
        onSuccess();
      }
      
      console.log('Upload completed successfully');
      
      // Reset state after successful upload with slight delay
      setTimeout(() => {
        resetUploadState();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error in upload process:', error);
      clearTimeout(0); // Clear any pending timeouts
      
      // Format error message for display
      const errorMessage = error.message || 'Upload failed';
      toast.error(errorMessage);
      
      setUploadError(error);
      if (onError) onError(error);
      
      // Reset uploading state after error
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };
  
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
  }, [applicationId]);
  
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
