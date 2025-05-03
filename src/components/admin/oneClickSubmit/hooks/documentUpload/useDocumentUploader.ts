
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadMerchantDocument } from '@/services/merchantApplicationService';
import { UploadDocumentOptions } from './types';

export const useDocumentUploader = (
  setUploading: (uploading: boolean) => void,
  setUploadProgress: (progress: number | ((prevProgress: number) => number)) => void,
  setUploadError: (error: Error | null) => void,
  loadDocuments: () => Promise<void>
) => {
  const uploadDocument = useCallback(async ({
    file,
    applicationId = '',
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
      console.warn('[useDocumentUploader] No applicationId provided for document upload');
    }
    
    // Reset any previous errors and set initial state
    setUploadError(null);
    setUploading(true);
    setUploadProgress(10);
    
    console.log(`[useDocumentUploader] Starting upload with applicationId: ${applicationId}, documentType: ${documentType}, file: ${file.name}`);
    
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
        
        console.log('[useDocumentUploader] Created merchant-documents bucket');
      }
      
      setUploadProgress(20);
      
      // Use a unique ID if no applicationId is provided
      const effectiveAppId = applicationId || `temp-${new Date().getTime()}`;
      
      // Upload file to storage
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${effectiveAppId}/${documentType || 'other'}_${timestamp}.${fileExt}`;
      
      setUploadProgress(30);
      
      console.log('[useDocumentUploader] Uploading file to path:', filePath);
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('merchant-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });
      
      if (uploadError) {
        console.error('[useDocumentUploader] Storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      
      console.log('[useDocumentUploader] File uploaded successfully to storage:', fileData);
      setUploadProgress(70);
      
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
        console.error('[useDocumentUploader] Database entry error:', dbError);
        throw new Error(`Database entry failed: ${dbError.message}`);
      }
      
      setUploadProgress(100);
      console.log('[useDocumentUploader] Document upload completed successfully');
      toast.success('Document uploaded successfully');
      
      // Refresh document list
      await loadDocuments();
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset state after successful upload with slight delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadError(null);
      }, 1000);
      
    } catch (error: any) {
      console.error('[useDocumentUploader] Error in upload process:', error);
      
      // Format error message for display
      const errorMessage = error.message || 'Upload failed';
      toast.error(errorMessage);
      
      // Update state and call error callback
      setUploadError(error);
      setUploading(false);
      setUploadProgress(0);
      
      if (onError) onError(error);
    }
  }, [setUploading, setUploadProgress, setUploadError, loadDocuments]);

  return {
    uploadDocument
  };
};
