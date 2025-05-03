
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, Eye, File, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset state when document changes
  React.useEffect(() => {
    if (open && document) {
      setLoading(true);
      setError(null);
    }
  }, [open, document]);

  // Handle document load error
  const handleLoadError = () => {
    setLoading(false);
    setError('Failed to load document. The file may be corrupted or inaccessible.');
  };

  // Handle document load success
  const handleLoadSuccess = () => {
    setLoading(false);
  };

  // Generate URL for the file
  const getDocumentUrl = () => {
    if (!document?.filePath) return '';
    
    try {
      const { data } = supabase.storage
        .from('merchant-documents')
        .getPublicUrl(document.filePath);
      
      return data.publicUrl;
    } catch (err) {
      console.error('Error generating URL:', err);
      setError('Error generating document URL');
      return '';
    }
  };

  if (!document) return null;

  const documentUrl = getDocumentUrl();
  const isPdf = document.fileType === 'application/pdf' || document.name.toLowerCase().endsWith('.pdf');
  const isImage = document.fileType?.startsWith('image/') || 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => document.name.toLowerCase().endsWith(`.${ext}`));
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      
      <Card className="w-full max-w-5xl h-[90vh] max-h-[90vh] z-50 flex flex-col bg-white">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <File className="h-5 w-5 text-blue-600" />
              <span className="truncate max-w-[400px]">{document.name}</span>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {documentUrl && (
                <a 
                  href={documentUrl} 
                  download={document.name}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download
                </a>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
            <span>
              {new Date(document.uploadDate).toLocaleDateString()} at {new Date(document.uploadDate).toLocaleTimeString()}
            </span>
            <span>•</span>
            <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-hidden relative p-0">
          {loading && <LoadingState />}
          
          {error ? (
            <ErrorState error={error} />
          ) : (
            <>
              {isPdf && (
                <iframe 
                  src={`${documentUrl}#view=FitH`}
                  className="w-full h-full border-0" 
                  onLoad={handleLoadSuccess}
                  onError={handleLoadError}
                />
              )}
              
              {isImage && (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 overflow-auto p-4">
                  <img
                    src={documentUrl}
                    alt={document.name}
                    className="max-w-full max-h-full object-contain"
                    onLoad={handleLoadSuccess}
                    onError={handleLoadError}
                  />
                </div>
              )}
              
              {!isPdf && !isImage && (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <File className="h-16 w-16 text-blue-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Preview Not Available</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    This file type cannot be previewed directly in the browser.
                  </p>
                  
                  {documentUrl && (
                    <Button asChild>
                      <a 
                        href={documentUrl} 
                        download={document.name}
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentViewModal;
