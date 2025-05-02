
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
    // Allow uploads even with minimal information
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    // Reset any previous errors
    setUploadError(null);
    console.log(`Starting upload with applicationId: ${applicationId}, documentType: ${documentType || 'other'}`);
    setUploading(true);
    setUploadProgress(10);
    
    try {
      // Check if storage bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucketExists = buckets?.some(bucket => bucket.name === 'merchant-documents');
      
      if (!documentsBucketExists) {
        await supabase.storage.createBucket('merchant-documents', {
          public: true, // Make bucket public for easy access
        });
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
          upsert: true // Change to true to avoid conflicts with existing files
        });
      
      clearInterval(progressInterval);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploadProgress(0);
        setUploadError(uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', fileData);
      setUploadProgress(90);
      
      // Create document record in database - make documentType optional
      const { error } = await uploadMerchantDocument({
        applicationId: effectiveAppId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath,
        documentType: documentType || 'other'
      });
      
      if (error) {
        console.error('Database error:', error);
        setUploadError(new Error(error.message));
        throw new Error(error.message);
      }
      
      setUploadProgress(100);
      toast.success('Document uploaded successfully');
      
      // Refresh document list
      loadDocuments();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(`Upload failed: ${error.message}`);
      setUploadError(error);
      if (onError) onError(error);
    } finally {
      // Always ensure we reset the state after a reasonable delay
      // regardless of success or failure
      setTimeout(() => {
        resetUploadState();
      }, 1500);
    }
  };
  
  const loadDocuments = useCallback(async () => {
    if (!applicationId) return;
    
    try {
      console.log('Loading documents for application:', applicationId);
      const { data, error } = await getMerchantDocuments(applicationId);
      
      if (error) {
        console.error('Error loading documents:', error);
        throw error;
      }
      
      console.log('Documents loaded:', data);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      // Don't show toast here to avoid spamming the user with errors
    }
  }, [applicationId]);
  
  // Load documents on initial mount
  useEffect(() => {
    if (applicationId) {
      loadDocuments();
    }
  }, [applicationId, loadDocuments]);
  
  return {
    uploading,
    uploadProgress,
    uploadError,
    documents,
    uploadDocument,
    loadDocuments,
    resetUploadState
  };
};
