
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadMerchantDocument } from '@/services/merchantApplicationService';

interface UploadDocumentOptions {
  file: File;
  applicationId: string;
  documentType: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDocumentUpload = (applicationId: string) => {
  const [uploading, setUploading] = useState(false);
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
    
    try {
      // Check if storage bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucketExists = buckets?.some(bucket => bucket.name === 'merchant-documents');
      
      if (!documentsBucketExists) {
        await supabase.storage.createBucket('merchant-documents', {
          public: false,
        });
      }
      
      // Upload file to storage
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${applicationId}/${timestamp}_${file.name}`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('merchant-documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', fileData);
      
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
      setUploading(false);
    }
  };
  
  const loadDocuments = async () => {
    if (!applicationId) return;
    
    try {
      const { data, error } = await supabase
        .from('merchant_documents')
        .select('*')
        .eq('merchant_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };
  
  // Load documents on initial mount
  useState(() => {
    loadDocuments();
  });
  
  return {
    uploading,
    documents,
    uploadDocument,
    loadDocuments
  };
};
