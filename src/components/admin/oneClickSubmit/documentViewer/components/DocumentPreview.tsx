
import React, { useState } from 'react';
import { File, FileText, Image } from 'lucide-react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface DocumentPreviewProps {
  documentUrl: string;
  documentName: string;
  documentType?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentUrl, documentName, documentType }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPdf = documentType?.includes('pdf') || documentName.toLowerCase().endsWith('.pdf');
  const isImage = documentType?.includes('image') || 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => documentName.toLowerCase().endsWith(`.${ext}`));

  const handleLoadSuccess = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    setLoading(false);
    setError(`Failed to load document: ${documentName}`);
  };

  return (
    <div className="relative w-full h-full">
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
                alt={documentName}
                className="max-w-full max-h-full object-contain"
                onLoad={handleLoadSuccess}
                onError={handleLoadError}
              />
            </div>
          )}
          
          {!isPdf && !isImage && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              {documentType?.includes('text') ? (
                <FileText className="h-16 w-16 text-blue-300 mb-4" />
              ) : (
                <File className="h-16 w-16 text-blue-300 mb-4" />
              )}
              <h3 className="text-xl font-semibold mb-2">Preview Not Available</h3>
              <p className="text-muted-foreground text-center">
                This file type cannot be previewed directly in the browser.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
