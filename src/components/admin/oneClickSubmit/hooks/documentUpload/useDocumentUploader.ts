
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

/**
 * Hook for handling document uploads with progress tracking
 */
export const useDocumentUploader = (
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
  setUploadError: React.Dispatch<React.SetStateAction<Error | null>>,
  onSuccess?: () => Promise<void>
) => {
  // Track mounted state to prevent state updates after unmount
  const mountedRef = useRef(true);
  
  // Set up cleanup function
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Upload document with progress tracking and error handling
  const uploadDocument = useCallback(async (options: {
    file: File;
    applicationId: string;
    documentType: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
  }) => {
    const { file, applicationId, documentType, onSuccess: optionsOnSuccess, onError, onProgress } = options;
    
    if (!file) {
      const error = new Error(`Invalid upload parameters. File is missing.`);
      if (mountedRef.current) setUploadError(error);
      if (onError) onError(error);
      return Promise.reject(error);
    }
    
    if (mountedRef.current) {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
    }
    
    try {
      console.log(`[useDocumentUploader] Starting upload for ${file.name} (${file.size} bytes)`);
      
      // Step 1: First check for the merchant-documents bucket
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'merchant-documents');
        
        if (!bucketExists) {
          console.log('[useDocumentUploader] Creating merchant-documents bucket');
          try {
            await supabase.storage.createBucket('merchant-documents', {
              public: true,
              fileSizeLimit: 50 * 1024 * 1024 // 50MB
            });
          } catch (bucketError) {
            console.warn('[useDocumentUploader] Bucket creation error (may already exist):', bucketError);
          }
        }
      } catch (bucketCheckError) {
        console.warn('[useDocumentUploader] Bucket check error:', bucketCheckError);
        // Continue anyway as this might be a permission issue but bucket might exist
      }
      
      if (mountedRef.current) setUploadProgress(10);
      if (onProgress) onProgress(10);
      
      // Step 2: Upload file to storage
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      // For temporary mode, use a special directory
      const isTemporary = applicationId.startsWith('temp_');
      const filePath = isTemporary
        ? `temporary/${applicationId}/${timestamp}_${file.name.replace(/\s+/g, '_')}`
        : `${applicationId}/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      
      console.log(`[useDocumentUploader] Uploading file to path: ${filePath}`);
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('merchant-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (storageError) {
        console.error('[useDocumentUploader] Storage upload error:', storageError);
        throw new Error(`Storage error: ${storageError.message}`);
      }
      
      console.log('[useDocumentUploader] File uploaded successfully:', storageData);
      if (mountedRef.current) setUploadProgress(50);
      if (onProgress) onProgress(50);
      
      // Step 3: For temporary uploads, store metadata in localStorage
      // For regular uploads, save to the database
      if (isTemporary) {
        try {
          // Create a local record of the upload
          const tempDocId = uuidv4();
          const tempDocData = {
            id: tempDocId,
            file_name: file.name,
            file_type: file.type || `application/${fileExt}`,
            file_size: file.size,
            file_path: filePath,
            document_type: documentType,
            created_at: new Date().toISOString(),
            uploaded_by: 'temporary_session'
          };
          
          // Store in localStorage
          const tempUploadsKey = `temp_documents_${applicationId}`;
          const existingUploads = JSON.parse(localStorage.getItem(tempUploadsKey) || '[]');
          existingUploads.push(tempDocData);
          localStorage.setItem(tempUploadsKey, JSON.stringify(existingUploads));
          
          console.log('[useDocumentUploader] Temporary document metadata stored:', tempDocData);
          if (mountedRef.current) setUploadProgress(100);
          if (onProgress) onProgress(100);
          
          // Call onSuccess callbacks
          if (optionsOnSuccess) optionsOnSuccess();
          if (onSuccess && mountedRef.current) await onSuccess();
          
          return Promise.resolve({
            success: true,
            data: tempDocData
          });
        } catch (localStorageError) {
          console.error('[useDocumentUploader] Error storing temporary document:', localStorageError);
          throw new Error(`Local storage error: ${localStorageError.message}`);
        }
      } else {
        // Regular upload - save to database using auth session
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        
        const metadataPayload = {
          entityId: applicationId,
          entityType: 'merchant',
          docType: documentType,
          fileName: file.name,
          fileType: file.type || `application/${fileExt}`,
          fileSize: file.size,
          filePath: filePath,
          userName: 'web_app'
        };
        
        console.log('[useDocumentUploader] Saving document metadata:', metadataPayload);
        
        // Call the edge function to save metadata (this uses service role to bypass RLS)
        const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/upload-document', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metadataPayload)
        });
        
        if (mountedRef.current) setUploadProgress(75);
        if (onProgress) onProgress(75);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[useDocumentUploader] Edge function error:', errorText);
          throw new Error(`Metadata save failed: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('[useDocumentUploader] Document metadata saved:', result);
        
        if (mountedRef.current) setUploadProgress(100);
        if (onProgress) onProgress(100);
        
        // Call onSuccess callbacks
        if (optionsOnSuccess) optionsOnSuccess();
        if (onSuccess && mountedRef.current) await onSuccess();
        
        console.log('[useDocumentUploader] Upload completed successfully');
        return Promise.resolve(result);
      }
      
    } catch (error: any) {
      console.error('[useDocumentUploader] Upload error:', error);
      if (mountedRef.current) setUploadError(error);
      
      if (onError) onError(error);
      
      return Promise.reject(error);
    } finally {
      if (mountedRef.current) {
        setUploading(false);
        // Reset progress after a short delay
        setTimeout(() => {
          if (mountedRef.current) {
            setUploadProgress(0);
          }
        }, 1500);
      }
    }
  }, [setUploading, setUploadProgress, setUploadError, onSuccess]);
  
  return { uploadDocument };
};
