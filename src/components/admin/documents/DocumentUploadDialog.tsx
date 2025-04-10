
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import FileUpload from '@/components/file-upload/FileUpload';
import { createDocument } from './api';
import { DocumentForm } from './form/DocumentForm';
import { documentFormSchema, DocumentFormValues } from './form';
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      document_type: 'other',
      is_template: false,
    },
  });
  
  const handleFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      
      // Auto-set the name if empty
      if (!form.getValues('name')) {
        form.setValue('name', files[0].name.split('.')[0]);
      }
    }
  };
  
  const onSubmit = async (values: DocumentFormValues) => {
    if (!selectedFile) {
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
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${timestamp}_${selectedFile.name}`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
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
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        owner_id: user.id,
        uploaded_by: user.id,
        document_type: values.document_type,
        is_template: values.is_template
      };
      
      const newDocument = await createDocument(documentData);
      console.log('Document created successfully:', newDocument);
      
      toast.success('Document uploaded successfully');
      onUploadSuccess();
      reset();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const reset = () => {
    form.reset();
    setSelectedFile(null);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a PDF document to the system. Documents can be templates or regular files.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="mb-4">
                <FileUpload
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  maxSize={10 * 1024 * 1024} // 10MB
                  onFilesChange={handleFilesChange}
                />
              </div>
              
              <DocumentForm form={form} />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={reset}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Document'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
