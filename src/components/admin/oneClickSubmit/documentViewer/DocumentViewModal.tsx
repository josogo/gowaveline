
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentPreview } from './components/DocumentPreview';
import { DocumentFooter } from './components/DocumentFooter';
import { DocumentViewItem } from '../hooks/documentUpload/types';

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentViewItem | null;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  document
}) => {
  // Reset state when document changes
  React.useEffect(() => {
    if (!open) {
      // Reset state when modal is closed
    }
  }, [open]);

  if (!document) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 font-medium">
              <File className="h-5 w-5 text-blue-600" />
              <span className="max-w-[400px] truncate">{document.name}</span>
            </DialogTitle>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span>
              {new Date(document.uploadDate).toLocaleDateString()} at {new Date(document.uploadDate).toLocaleTimeString()}
            </span>
            <span>•</span>
            <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden relative">
          <DocumentPreview 
            documentUrl={document.url || ''}
            documentName={document.name}
            documentType={document.fileType}
          />
        </div>
        
        <DocumentFooter
          documentUrl={document.url}
          documentName={document.name}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
