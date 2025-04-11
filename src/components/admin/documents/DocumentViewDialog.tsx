
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Calendar, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (document && open) {
      fetchDocument();
    } else {
      setPdfUrl(null);
      setLoadError(null);
      setRetryCount(0);
    }
  }, [document, open]);

  const fetchDocument = async () => {
    if (!document) return;
    
    setLoading(true);
    setLoadError(null);
    
    try {
      console.log('Fetching document:', document.file_path);
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry
      
      if (error) {
        console.error('Error fetching document URL:', error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned');
      }
      
      console.log('Document URL fetched successfully, length:', data.signedUrl.length);
      setPdfUrl(data.signedUrl);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching document:', error);
      setLoadError(error.message || 'Failed to load document');
      setLoading(false);
      toast.error('Failed to load document');
    }
  };
  
  const handleRetry = () => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached');
      return;
    }
    
    setRetryCount(prev => prev + 1);
    fetchDocument();
  };
  
  const handleDownload = async () => {
    if (!document || !pdfUrl) return;
    
    try {
      console.log('Downloading document:', document.name);
      
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
        ) : loadError ? (
          <div className="flex-grow flex flex-col items-center justify-center text-red-500">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <p className="text-center mb-4">{loadError}</p>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              disabled={retryCount >= maxRetries}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Retry Loading Document
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-hidden">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title={document?.name || 'Document'}
                  onError={() => {
                    console.error('Error loading PDF in iframe');
                    setLoadError('Failed to load document preview');
                  }}
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
