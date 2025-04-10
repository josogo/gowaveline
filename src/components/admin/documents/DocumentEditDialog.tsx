
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
import { DocumentItem } from './types';
import { updateDocument } from './api';
import { Form } from '@/components/ui/form';
import { 
  documentFormSchema, 
  DocumentFormValues,
  DocumentForm
} from './form';

interface DocumentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
  onUpdateSuccess: () => void;
}

export const DocumentEditDialog: React.FC<DocumentEditDialogProps> = ({
  open,
  onOpenChange,
  document,
  onUpdateSuccess,
}) => {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: document?.name || '',
      description: document?.description || '',
      // Cast the document_type to the allowed enum type using type assertion
      document_type: (document?.document_type as DocumentFormValues['document_type']) || 'other',
      is_template: document?.is_template || false,
    }
  });
  
  // Update form when document changes
  React.useEffect(() => {
    if (document) {
      form.reset({
        name: document.name,
        description: document.description || '',
        // Cast the document_type to the allowed enum type
        document_type: (document.document_type as DocumentFormValues['document_type']) || 'other',
        is_template: document.is_template || false,
      });
    }
  }, [document, form]);
  
  const onSubmit = async (values: DocumentFormValues) => {
    if (!document) return;
    
    try {
      await updateDocument(document.id, {
        name: values.name,
        description: values.description || null,
        document_type: values.document_type,
        is_template: values.is_template
      });
      
      toast.success('Document updated successfully');
      onUpdateSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating document:', error);
      toast.error(`Update failed: ${error.message}`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update document details and properties.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DocumentForm form={form} />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
