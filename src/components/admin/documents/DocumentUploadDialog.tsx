
import React from 'react';
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
import { DocumentForm } from './form/DocumentForm';
import { documentFormSchema, DocumentFormValues } from './form';
import { useDocumentUpload } from './hooks';

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
  const { uploading, selectedFile, handleFilesChange, uploadDocument, reset } = useDocumentUpload();
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      document_type: 'other',
      is_template: false,
    },
  });
  
  const handleFileChange = (files: File[]) => {
    const file = handleFilesChange(files);
    
    // Auto-set the name if empty
    if (file && !form.getValues('name')) {
      form.setValue('name', file.name.split('.')[0]);
    }
  };
  
  const onSubmit = async (values: DocumentFormValues) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    await uploadDocument({
      values,
      file: selectedFile,
      onSuccess: () => {
        onUploadSuccess();
        handleDialogClose();
      }
    });
  };
  
  const handleDialogClose = () => {
    form.reset();
    reset();
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
                  onFilesChange={handleFileChange}
                />
              </div>
              
              <DocumentForm form={form} />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDialogClose}
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
