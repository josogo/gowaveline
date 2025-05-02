
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText, AlertTriangle, RefreshCw, XCircle, File, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

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
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };
  
  const getDocumentIcon = () => {
    if (!documentFile?.fileType) return <FileText className="h-16 w-16 text-gray-300" />;
    
    if (documentFile.fileType.includes('pdf')) {
      return <FileText className="h-16 w-16 text-red-400" />;
    } else if (documentFile.fileType.includes('image')) {
      return <Image className="h-16 w-16 text-blue-400" />;
    } else {
      return <File className="h-16 w-16 text-gray-400" />;
    }
  };
  
  const getFileTypeDisplay = () => {
    if (!documentFile?.fileType) return 'Unknown';
    
    if (documentFile.fileType.includes('pdf')) {
      return 'PDF Document';
    } else if (documentFile.fileType.includes('image')) {
      return 'Image';
    } else if (documentFile.fileType.includes('word')) {
      return 'Word Document';
    } else {
      return documentFile.fileType.split('/').pop() || 'Document';
    }
  };
  
  const isPreviewable = () => {
    if (!documentFile?.fileType) return false;
    return documentFile.fileType.includes('pdf') || documentFile.fileType.includes('image');
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
        
        {loading ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <div className="text-center">
              <p className="mb-4">Loading document...</p>
              {downloadProgress > 0 && (
                <div className="w-48 mx-auto">
                  <Progress value={downloadProgress} className="h-1.5" />
                </div>
              )}
            </div>
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
            <div className="flex-grow overflow-hidden min-h-0 bg-gray-50 border rounded-md">
              {documentUrl && isPreviewable() ? (
                documentFile?.fileType?.includes('image') ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
                    <img 
                      src={documentUrl} 
                      alt={documentFile.name}
                      className="max-w-full max-h-full object-contain"
                      onError={() => setError('Failed to load image')} 
                    />
                  </div>
                ) : (
                  <iframe
                    src={documentUrl}
                    className="w-full h-full border-0"
                    title={documentFile?.name || 'Document'}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    onError={() => setError('Failed to load document preview')}
                  />
                )
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-gray-500">
                  {getDocumentIcon()}
                  <p className="mt-4">Document preview not available</p>
                  {documentUrl && (
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="py-3 space-y-1 border-t mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">File type:</span>
                <span className="font-medium">{getFileTypeDisplay()}</span>
              </div>
              {documentFile && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Upload date:</span>
                  <span className="font-medium">{formatDate(documentFile.uploadDate)}</span>
                </div>
              )}
              {isDownloading && downloadProgress > 0 && (
                <div className="w-full pt-2">
                  <Progress value={downloadProgress} className="h-1.5" />
                </div>
              )}
            </div>
          </>
        )}
        
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
