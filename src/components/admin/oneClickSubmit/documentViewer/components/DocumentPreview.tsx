
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File } from 'lucide-react';
import { isPreviewable } from '../utils/fileHelpers';

interface DocumentPreviewProps {
  documentUrl: string | null;
  documentFile: {
    name: string;
    fileType?: string;
  } | null;
  onError: () => void;
  onDownload: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentUrl,
  documentFile,
  onError,
  onDownload
}) => {
  if (!documentFile) return null;
  
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
  
  if (documentUrl && isPreviewable(documentFile.fileType)) {
    if (documentFile.fileType?.includes('image')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
          <img 
            src={documentUrl} 
            alt={documentFile.name}
            className="max-w-full max-h-full object-contain"
            onError={onError}
          />
        </div>
      );
    } else {
      return (
        <iframe
          src={documentUrl}
          className="w-full h-full border-0"
          title={documentFile?.name || 'Document'}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onError={onError}
        />
      );
    }
  }

  return (
    <div className="flex flex-col h-full items-center justify-center text-gray-500">
      {getDocumentIcon()}
      <p className="mt-4">Document preview not available</p>
      {documentUrl && (
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download to View
        </Button>
      )}
    </div>
  );
};
