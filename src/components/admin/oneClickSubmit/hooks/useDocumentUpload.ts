
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
      
      // Simulate incremental upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      console.log('Uploading file to path:', filePath);
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('merchant-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true // Change to true to avoid conflicts with existing files
        });
      
      clearInterval(progressInterval);
      setUploadProgress(90);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', fileData);
      setUploadProgress(95);
      
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
      if (onError) onError(error);
    } finally {
      // Ensure the uploading state is reset after a short delay
      // This gives the user time to see the success/error toast
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
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
      // if the documents fail to load multiple times
    }
  }, [applicationId]);
  
  // Load documents on initial mount
  useEffect(() => {
    loadDocuments();
  }, [applicationId, loadDocuments]);
  
  return {
    uploading,
    uploadProgress,
    documents,
    uploadDocument,
    loadDocuments
  };
};
