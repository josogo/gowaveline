
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DocumentItem } from './types';
import { format } from 'date-fns';

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document && open) {
      setLoading(true);
      
      const fetchDocument = async () => {
        try {
          if (document.isStandard) {
            // For standard documents, use a direct URL
            // This assumes you've uploaded these files to the Supabase storage
            // and made them publicly accessible
            const { data, error } = await supabase.storage
              .from('documents')
              .createSignedUrl(document.file_path, 3600); // 1 hour expiry

            if (error) throw error;
            
            setPdfUrl(data.signedUrl);
          } else {
            // For regular documents, get the signed URL
            const { data, error } = await supabase.storage
              .from('documents')
              .createSignedUrl(document.file_path, 3600); // 1 hour expiry
            
            if (error) throw error;
            
            setPdfUrl(data.signedUrl);
          }
          
          setLoading(false);
        } catch (error: any) {
          console.error('Error fetching document:', error);
          toast.error('Failed to load document');
          setLoading(false);
        }
      };
      
      fetchDocument();
    } else {
      setPdfUrl(null);
    }
  }, [document, open]);
  
  const handleDownload = async () => {
    if (!document || !pdfUrl) return;
    
    try {
      // Create a link element and trigger the download
      const link = window.document.createElement('a');
      link.href = pdfUrl;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] sm:h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{document?.name || 'Document'}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-hidden">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title={document?.name || 'Document'}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <FileText className="h-16 w-16 opacity-20 mb-4" />
                  <p>Document preview not available</p>
                </div>
              )}
            </div>
            
            <div className="py-2 text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created: {document ? formatDate(document.created_at) : 'N/A'}
            </div>
          </>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={loading || !pdfUrl}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
