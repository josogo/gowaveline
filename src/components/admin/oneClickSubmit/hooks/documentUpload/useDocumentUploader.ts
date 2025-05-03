
import { useCallback, useRef } from 'react';
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
  // Use refs to track and prevent multiple concurrent uploads and component mount status
  const uploadingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Set up mount status tracking
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const uploadDocument = useCallback(async ({
    file,
    applicationId = '',
    documentType = 'other',
    onSuccess,
    onError
  }: UploadDocumentOptions) => {
    // Prevent multiple uploads and check if component is still mounted
    if (uploadingRef.current) {
      console.log('[useDocumentUploader] Upload already in progress, ignoring request');
      return;
    }

    // Validate inputs
    if (!file) {
      const error = new Error('Please select a file to upload');
      toast.error(error.message);
      if (onError) onError(error);
      return;
    }
    
    if (!applicationId) {
      const error = new Error('Application ID is required for document upload');
      console.error('[useDocumentUploader]', error.message);
      toast.error(error.message);
      if (onError) onError(error);
      return;
    }
    
    // Set uploading state
    uploadingRef.current = true;
    if (isMountedRef.current) {
      setUploadError(null);
      setUploading(true);
      setUploadProgress(10);
    }
    
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
      
      if (isMountedRef.current) setUploadProgress(20);
      
      // Use a unique ID if no applicationId is provided
      const effectiveAppId = applicationId || `temp-${new Date().getTime()}`;
      
      // Upload file to storage
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${effectiveAppId}/${documentType || 'other'}_${timestamp}.${fileExt}`;
      
      if (isMountedRef.current) setUploadProgress(30);
      
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
      if (isMountedRef.current) setUploadProgress(70);
      
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
      
      if (isMountedRef.current) setUploadProgress(100);
      console.log('[useDocumentUploader] Document upload completed successfully');
      toast.success('Document uploaded successfully');
      
      // Refresh document list
      try {
        await loadDocuments();
      } catch (loadError) {
        console.error('[useDocumentUploader] Error refreshing document list:', loadError);
        // Don't fail the overall upload operation if this fails
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset state after successful upload with slight delay
      setTimeout(() => {
        if (isMountedRef.current) {
          setUploading(false);
          setUploadProgress(0);
          setUploadError(null);
        }
        uploadingRef.current = false;
      }, 1000);
      
    } catch (error: any) {
      console.error('[useDocumentUploader] Error in upload process:', error);
      
      // Format error message for display
      const errorMessage = error.message || 'Upload failed';
      toast.error(errorMessage);
      
      // Update state and call error callback
      if (isMountedRef.current) {
        setUploadError(error);
        setUploading(false);
        setUploadProgress(0);
      }
      
      if (onError) onError(error);
      
      uploadingRef.current = false;
    }
  }, [setUploading, setUploadProgress, setUploadError, loadDocuments]);

  return {
    uploadDocument
  };
};

// Add missing import
import { useEffect } from 'react';
