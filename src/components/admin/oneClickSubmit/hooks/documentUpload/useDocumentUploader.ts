
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadMerchantDocument } from '@/services/merchantApplicationService';
import { UploadDocumentOptions } from './types';

export const useDocumentUploader = (
  setUploading: (uploading: boolean) => void,
  setUploadProgress: (progress: number | ((prevProgress: number) => number)) => void, // Updated type definition to accept function updates
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
        setUploadProgress((prev: number) => Math.min(prev + 5, 85));
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
        setUploading(false);
        setUploadProgress(0);
        setUploadError(null);
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
  }, [setUploading, setUploadProgress, setUploadError, loadDocuments]);

  return {
    uploadDocument
  };
};
