
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getMerchantDocuments, uploadMerchantDocument } from '@/services/merchantApplicationService';

interface UploadDocumentOptions {
  file: File;
  applicationId: string;
  documentType: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDocumentUpload = (applicationId: string) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<any[]>([]);
  
  const uploadDocument = async ({
    file,
    documentType,
    onSuccess,
    onError
  }: UploadDocumentOptions) => {
    if (!file || !applicationId) {
      toast.error('Missing required information for upload');
      return;
    }
    
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
        setUploadProgress(20);
      }
      
      // Upload file to storage with simulated progress
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${applicationId}/${documentType}_${timestamp}.${fileExt}`;
      
      setUploadProgress(30);
      
      // Simulate incremental upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('merchant-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });
      
      clearInterval(progressInterval);
      setUploadProgress(90);
      
      if (uploadError) {
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', fileData);
      setUploadProgress(95);
      
      // Create document record in database
      const { error } = await uploadMerchantDocument({
        applicationId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath,
        documentType
      });
      
      if (error) {
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
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };
  
  const loadDocuments = async () => {
    if (!applicationId) return;
    
    try {
      const { data, error } = await getMerchantDocuments(applicationId);
      
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };
  
  // Load documents on initial mount
  useEffect(() => {
    loadDocuments();
  }, [applicationId]);
  
  return {
    uploading,
    uploadProgress,
    documents,
    uploadDocument,
    loadDocuments
  };
};
