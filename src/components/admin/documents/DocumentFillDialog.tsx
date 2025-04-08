
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Document } from './types';
import { supabase } from '@/integrations/supabase/client';
import { createDocument } from './types';

interface DocumentFillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onSuccess: () => void;
}

interface Field {
  name: string;
  value: string;
  placeholder: string;
  isRequired: boolean;
}

export const DocumentFillDialog: React.FC<DocumentFillDialogProps> = ({
  open,
  onOpenChange,
  document,
  onSuccess,
}) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (document && open) {
      setLoading(true);
      
      // For this example, we'll use predefined fields
      // In a real app, you'd extract fields from the PDF template
      const defaultFields: Field[] = [
        { name: 'businessName', value: '', placeholder: 'Business Name', isRequired: true },
        { name: 'contactName', value: '', placeholder: 'Contact Name', isRequired: true },
        { name: 'email', value: '', placeholder: 'Email Address', isRequired: true },
        { name: 'phone', value: '', placeholder: 'Phone Number', isRequired: true },
        { name: 'address', value: '', placeholder: 'Business Address', isRequired: false },
        { name: 'date', value: new Date().toLocaleDateString(), placeholder: 'Date', isRequired: true }
      ];
      
      setFields(defaultFields);
      setLoading(false);
    }
  }, [document, open]);
  
  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };
  
  const handleFillDocument = async (shouldSave: boolean = false) => {
    if (!document) return;
    
    // Check required fields
    const missingRequiredFields = fields.filter(f => f.isRequired && !f.value);
    if (missingRequiredFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingRequiredFields.map(f => f.placeholder).join(', ')}`);
      return;
    }
    
    setProcessing(true);
    
    try {
      // Create a data object from the fields
      const formData = fields.reduce((obj, field) => {
        obj[field.name] = field.value;
        return obj;
      }, {} as Record<string, string>);
      
      // Get the document from storage to pass to the edge function
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry
      
      if (fileError) throw fileError;
      
      // Call the edge function to fill the PDF
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/fill-pdf-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          templateUrl: fileData.signedUrl,
          formData: formData
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fill PDF: ${errorText}`);
      }
      
      // Get PDF bytes from response
      const pdfBlob = await response.blob();
      
      // If user wants to save the document
      if (shouldSave) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Upload to storage
        const fileName = `Filled_${document.name}_${new Date().getTime()}.pdf`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, pdfBlob, {
            contentType: 'application/pdf',
            upsert: false
          });
        
        if (uploadError) throw uploadError;
        
        // Create document record
        await createDocument({
          name: `Filled - ${document.name}`,
          description: `Form filled based on template ${document.name}`,
          file_path: filePath,
          file_type: 'application/pdf',
          file_size: pdfBlob.size,
          uploaded_by: user.id,
          document_type: 'contract',
          is_template: false,
          metadata: { 
            templateId: document.id,
            filledData: formData 
          }
        });
        
        toast.success('Filled document saved successfully');
        onSuccess();
      }
      
      // Create download URL and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Filled_${document.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (!shouldSave) {
        toast.success('Document filled successfully');
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error filling document:', error);
      toast.error(`Failed to fill document: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !processing && onOpenChange(open)}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Fill Template Document</DialogTitle>
          <DialogDescription>
            {document ? `Fill in the fields for "${document.name}"` : 'Complete the form fields below'}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {fields.map((field, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={`field-${index}`}>
                  {field.placeholder}
                  {field.isRequired && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={`field-${index}`}
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFillDocument(true)}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save & Download
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => handleFillDocument(false)}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Only
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
