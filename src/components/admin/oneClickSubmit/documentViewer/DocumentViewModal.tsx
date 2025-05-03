
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { File, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentPreview, DocumentFooter } from './components';
import { DocumentViewItem } from '../hooks/documentUpload/types';

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentViewItem | null;
  onDelete?: (document: DocumentViewItem) => void;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  document,
  onDelete
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  // Generate URL and reset state when document changes
  useEffect(() => {
    if (open && document) {
      setLoading(true);
      setError(null);
      setDocumentUrl(null);

      if (document.filePath) {
        try {
          const { data } = supabase.storage
            .from('merchant-documents')
            .getPublicUrl(document.filePath);
          
          setDocumentUrl(data.publicUrl);
        } catch (err) {
          console.error('Error generating URL:', err);
          setError('Error generating document URL');
        }
      }
    }
  }, [open, document]);

  // Handle document load events
  const handleLoadError = () => {
    setLoading(false);
    setError('Failed to load document. The file may be corrupted or inaccessible.');
  };

  const handleLoadSuccess = () => {
    setLoading(false);
  };

  const handleDelete = () => {
    if (document && onDelete) {
      onDelete(document);
      onOpenChange(false);
    }
  };

  if (!document) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-medium">
              <File className="h-5 w-5 text-blue-600" />
              <span className="truncate max-w-[300px]">{document.name}</span>
            </DialogTitle>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mt-1">
            <span>
              {new Date(document.uploadDate).toLocaleDateString()} at {new Date(document.uploadDate).toLocaleTimeString()}
            </span>
            <span className="mx-2">•</span>
            <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden flex flex-col">
          <DocumentPreview 
            documentUrl={documentUrl || ''} 
            documentType={document.fileType} 
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            isLoading={loading}
            error={error}
          />
        </div>
        
        <DocumentFooter
          documentUrl={documentUrl || undefined}
          documentName={document.name}
          onDelete={onDelete ? handleDelete : undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
