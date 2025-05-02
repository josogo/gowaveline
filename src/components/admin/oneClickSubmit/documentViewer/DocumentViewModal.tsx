
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DocumentPreview } from './components/DocumentPreview';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { DocumentFooter } from './components/DocumentFooter';

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
    size?: number;
  } | null;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  document: documentFile,
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const maxRetries = 3;

  // Reset state when modal opens/closes or document changes
  useEffect(() => {
    if (documentFile && open) {
      setError(null);
      setRetryCount(0);
      setLoading(true);
      setDocumentUrl(null);
      setDownloadProgress(0);
      setIsDownloading(false);
      fetchDocumentUrl();
    } else {
      setDocumentUrl(null);
      setError(null);
      setRetryCount(0);
      setLoading(false);
      setDownloadProgress(0);
      setIsDownloading(false);
    }
  }, [documentFile, open]);

  const fetchDocumentUrl = async () => {
    if (!documentFile?.filePath) {
      setError('Document path is missing');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching document URL for:', documentFile.filePath);
      
      // Simulate progress during fetch
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const { data, error } = await supabase.storage
        .from('merchant-documents')
        .createSignedUrl(documentFile.filePath, 3600); // 1 hour expiry
      
      clearInterval(progressInterval);
      
      if (error) {
        console.error('Error fetching document URL:', error);
        setDownloadProgress(0);
        throw error;
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned from storage');
      }
      
      console.log('Document URL fetched successfully');
      setDocumentUrl(data.signedUrl);
      setDownloadProgress(100);
      
      // Reset download progress after showing 100% briefly
      setTimeout(() => {
        setDownloadProgress(0);
      }, 500);
      
    } catch (error: any) {
      console.error('Error fetching document:', error);
      setError(error.message || 'Failed to load document');
      setLoading(false);
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
    if (!documentFile || !documentUrl) return;
    
    try {
      console.log('Downloading document:', documentFile.name);
      setIsDownloading(true);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
          return Math.min(newProgress, 100);
        });
      }, 200);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = documentFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Document downloaded successfully');
      
      // Reset progress after a brief delay
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
        clearInterval(progressInterval);
      }, 800);
      
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
      setDownloadProgress(0);
      setIsDownloading(false);
    }
  };
  
  const handlePreviewError = () => {
    setError('Failed to load document preview');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:h-[80vh] flex flex-col max-h-[90vh]">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex justify-between items-center">
            <span className="truncate max-w-[600px]" title={documentFile?.name || ''}>
              {documentFile?.name || 'Document'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => onOpenChange(false)}
            >
              <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden min-h-0 bg-gray-50 border rounded-md">
          {loading ? (
            <LoadingState downloadProgress={downloadProgress} />
          ) : error ? (
            <ErrorState 
              error={error}
              retryCount={retryCount}
              maxRetries={maxRetries}
              onRetry={handleRetry}
            />
          ) : (
            <DocumentPreview
              documentUrl={documentUrl}
              documentFile={documentFile}
              onError={handlePreviewError}
              onDownload={handleDownload}
            />
          )}
        </div>
        
        <DocumentFooter 
          documentFile={documentFile}
          isDownloading={isDownloading}
          downloadProgress={downloadProgress}
        />
        
        <DialogFooter className="border-t pt-3">
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={loading || !documentUrl || isDownloading}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
