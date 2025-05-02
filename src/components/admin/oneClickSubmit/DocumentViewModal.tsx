
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
  } | null;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (document && open) {
      fetchDocumentUrl();
    } else {
      setDocumentUrl(null);
      setError(null);
      setRetryCount(0);
    }
  }, [document, open]);

  const fetchDocumentUrl = async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching document URL for:', document.filePath);
      const { data, error } = await supabase.storage
        .from('merchant-documents')
        .createSignedUrl(document.filePath, 3600); // 1 hour expiry
      
      if (error) {
        console.error('Error fetching document URL:', error);
        throw error;
      }
      
      console.log('Document URL fetched successfully');
      setDocumentUrl(data?.signedUrl || null);
    } catch (error: any) {
      console.error('Error fetching document:', error);
      setError(error.message || 'Failed to load document');
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached');
      return;
    }
    
    setRetryCount(prev => prev + 1);
    fetchDocumentUrl();
  };
  
  const handleDownload = async () => {
    if (!document || !documentUrl) return;
    
    try {
      console.log('Downloading document:', document.name);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{document?.name || 'Document'}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading document...</span>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center text-red-500">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <p className="text-center mb-4">{error}</p>
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
              {documentUrl ? (
                <iframe
                  src={documentUrl}
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
            
            <div className="py-2 text-sm text-gray-500">
              {document && (
                <p>Upload date: {formatDate(document.uploadDate)}</p>
              )}
            </div>
          </>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={loading || !documentUrl}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
