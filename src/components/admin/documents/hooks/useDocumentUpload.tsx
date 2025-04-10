
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DocumentFormValues } from '../form';
import { createDocument } from '../api';

export interface UploadDocumentParams {
  values: DocumentFormValues;
  file: File;
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      return files[0];
    }
    return null;
  };
  
  const uploadDocument = async ({ values, file, onSuccess, onError }: UploadDocumentParams) => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      // Check if storage bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
      
      if (!documentsBucketExists) {
        await supabase.storage.createBucket('documents', {
          public: false,
        });
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Upload file to storage
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${timestamp}_${file.name}`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', fileData);
      
      // Create document record in database
      const documentData = {
        name: values.name,
        description: values.description || '',
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        owner_id: user.id,
        uploaded_by: user.id,
        document_type: values.document_type,
        is_template: values.is_template
      };
      
      const newDocument = await createDocument(documentData);
      console.log('Document created successfully:', newDocument);
      
      toast.success('Document uploaded successfully');
      onSuccess();
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(`Upload failed: ${error.message}`);
      if (onError) onError(error);
    } finally {
      setUploading(false);
    }
  };
  
  const reset = () => {
    setSelectedFile(null);
  };
  
  return {
    uploading,
    selectedFile,
    handleFilesChange,
    uploadDocument,
    reset
  };
}
