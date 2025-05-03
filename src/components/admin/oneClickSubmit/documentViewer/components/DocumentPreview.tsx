
import React from 'react';
import { Loader2 } from 'lucide-react';

interface DocumentPreviewProps {
  documentUrl: string;
  documentType: string;
  isLoading?: boolean;
  error?: string | null;
  onLoadSuccess?: () => void;
  onLoadError?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  documentUrl, 
  documentType,
  isLoading,
  error,
  onLoadSuccess,
  onLoadError
}) => {
  const isPdf = documentType?.includes('pdf');
  const isImage = documentType?.includes('image') || 
    documentType?.includes('jpg') || 
    documentType?.includes('jpeg') || 
    documentType?.includes('png') ||
    documentType?.includes('gif');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 mb-4">
          {error}
        </p>
      </div>
    );
  }
  
  if (!documentUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-600 mb-4">
          No document URL provided
        </p>
      </div>
    );
  }
  
  if (isPdf) {
    return (
      <iframe 
        src={`${documentUrl}#toolbar=0&navpanes=0`}
        className="w-full h-full min-h-[600px]"
        title="PDF document"
        onLoad={onLoadSuccess}
        onError={onLoadError}
      />
    );
  }
  
  if (isImage) {
    return (
      <div className="flex items-center justify-center p-4 w-full h-full">
        <img 
          src={documentUrl} 
          alt="Document preview" 
          className="max-w-full max-h-[700px] object-contain" 
          onLoad={onLoadSuccess}
          onError={onLoadError}
        />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-gray-600 mb-4">
        Preview not available for this file type ({documentType})
      </p>
      <a 
        href={documentUrl} 
        target="_blank" 
        rel="noreferrer"
        className="text-blue-600 hover:underline"
      >
        Open in new tab
      </a>
    </div>
  );
};

export default DocumentPreview;
