
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DocumentForm, { DocumentFormValues } from '../DocumentForm';

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: DocumentFormValues) => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for this deal.
          </DialogDescription>
        </DialogHeader>
        
        <DocumentForm 
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDialog;
