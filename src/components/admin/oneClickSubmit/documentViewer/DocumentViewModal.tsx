
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { DocumentPreview } from './components/DocumentPreview';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { DocumentFooter } from './components/DocumentFooter';

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
    url?: string;
  } | null;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reset loading and error when document changes
  React.useEffect(() => {
    if (document) {
      setIsLoading(true);
      setError(null);
    }
  }, [document]);
  
  const handleLoadSuccess = () => {
    setIsLoading(false);
    setError(null);
  };
  
  const handleLoadError = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
  };
  
  if (!document) {
    return null;
  }
  
  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 border-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {document.name}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-grow relative overflow-hidden bg-gray-100 min-h-[50vh]">
          {isLoading && <LoadingState />}
          
          {error && <ErrorState error={error} />}
          
          <DocumentPreview 
            document={document} 
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
          />
        </div>
        
        <DocumentFooter 
          document={document}
          onDownload={handleDownload}
        />
      </DialogContent>
    </Dialog>
  );
};
