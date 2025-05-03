
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { DocumentPreview } from './components/DocumentPreview';
import { DocumentFooter } from './components/DocumentFooter';
import { Loader2 } from 'lucide-react';

export interface DocumentViewItem {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  filePath: string;
  fileType: string;
  url?: string;
}

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentViewItem | null;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentUrl = async () => {
      if (!document || !document.filePath) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.storage
          .from('merchant-documents')
          .createSignedUrl(document.filePath, 3600); // URL valid for 1 hour
          
        if (error) throw error;
        
        if (data && data.signedUrl) {
          setDocumentUrl(data.signedUrl);
        } else {
          setError('Could not generate a preview URL');
        }
      } catch (err: any) {
        console.error('Error fetching document URL:', err);
        setError(err.message || 'Failed to load document');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open && document) {
      fetchDocumentUrl();
    } else {
      setDocumentUrl(null);
      setError(null);
    }
  }, [open, document]);
  
  const handleClose = () => {
    onOpenChange(false);
  };
  
  const documentName = document?.name || 'Document';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-medium">{documentName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-auto min-h-[400px] relative flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">Loading document...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center p-6">
              <p className="text-red-500 mb-2">Error loading document</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && documentUrl && (
            <DocumentPreview 
              documentUrl={documentUrl} 
              documentType={document?.fileType || ''}
            />
          )}
        </div>
        
        <DocumentFooter 
          documentUrl={documentUrl || undefined} 
          documentName={documentName} 
          onClose={handleClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
