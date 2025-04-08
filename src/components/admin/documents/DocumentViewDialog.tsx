
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText } from 'lucide-react';
import { DocumentItem } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        console.log('Fetching document URL for:', document.file_path);
        
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600); // 1 hour expiry
        
        if (error) {
          console.error('Error creating signed URL:', error);
          toast.error('Failed to fetch document: ' + error.message);
          throw error;
        }
        
        console.log('Document URL:', data?.signedUrl);
        setDocumentUrl(data.signedUrl);
      } catch (error) {
        console.error('Error fetching document URL:', error);
        toast.error('Error loading document');
      } finally {
        setLoading(false);
      }
    };
    
    if (open && document) {
      fetchDocumentUrl();
    } else {
      setDocumentUrl(null);
    }
  }, [document, open]);
  
  const handleDownload = async () => {
    if (!document || !documentUrl) return;
    
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success(`Downloading ${document.name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };
  
  // Helper function to determine if file is viewable in iframe
  const isViewable = (doc: DocumentItem | null) => {
    if (!doc) return false;
    const fileType = doc.name.split('.').pop()?.toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt'].includes(fileType || '');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[80vh] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden bg-gray-50 rounded-md border">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documentUrl ? (
            isViewable(document) ? (
              <iframe
                src={documentUrl}
                title={document?.name || 'Document preview'}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <FileText className="h-16 w-16 text-gray-400" />
                <p className="text-gray-500">Preview not available for this file type.</p>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download to view
                </Button>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Unable to preview this document. Please check storage permissions.
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            {document?.description}
            {document && <span className="ml-2 text-xs opacity-70">(Added on {new Date(document.created_at).toLocaleDateString()})</span>}
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
