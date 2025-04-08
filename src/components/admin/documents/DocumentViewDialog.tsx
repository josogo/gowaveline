
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { DocumentItem } from './types';
import { supabase } from '@/integrations/supabase/client';

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
}

export const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDocumentUrl = async () => {
      if (!document) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600); // 1 hour expiry
        
        if (error) throw error;
        
        setDocumentUrl(data.signedUrl);
      } catch (error) {
        console.error('Error fetching document URL:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocumentUrl();
  }, [document]);
  
  const handleDownload = async () => {
    if (!document || !documentUrl) return;
    
    const link = window.document.createElement('a');
    link.href = documentUrl;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[80vh] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {document?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documentUrl ? (
            <iframe
              src={documentUrl}
              title={document?.name || 'Document preview'}
              className="w-full h-full border rounded-md"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Unable to preview this document
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {document?.description}
          </div>
          
          <Button onClick={handleDownload} disabled={!documentUrl}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
