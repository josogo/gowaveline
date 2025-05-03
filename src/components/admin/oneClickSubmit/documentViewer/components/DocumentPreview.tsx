
import React, { useState, useEffect } from 'react';
import { FileText, ImageIcon } from 'lucide-react';

interface DocumentPreviewProps {
  document: {
    id: string;
    name: string;
    fileType: string;
    url?: string;
  };
  onLoadSuccess: () => void;
  onLoadError: (error: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onLoadSuccess,
  onLoadError
}) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(false);
  }, [document.id]);
  
  if (!document.url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No preview available
      </div>
    );
  }
  
  // Handle different file types
  const isPdf = document.fileType?.includes('pdf');
  const isImage = document.fileType?.includes('image');
  
  if (isPdf) {
    return (
      <div className="w-full h-full">
        <iframe 
          src={`${document.url}#toolbar=0&view=FitH`}
          className="w-full h-full"
          onLoad={() => {
            setLoaded(true);
            onLoadSuccess();
          }}
          onError={() => onLoadError('Failed to load PDF document')}
          title={document.name}
        />
      </div>
    );
  }
  
  if (isImage) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <img 
          src={document.url} 
          alt={document.name}
          className={`max-w-full max-h-full object-contain ${!loaded ? 'invisible' : ''}`}
          onLoad={() => {
            setLoaded(true);
            onLoadSuccess();
          }}
          onError={() => onLoadError('Failed to load image')}
        />
      </div>
    );
  }
  
  // For other file types, show a generic preview
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center">
        {isPdf ? (
          <FileText className="h-24 w-24 text-red-500" />
        ) : isImage ? (
          <ImageIcon className="h-24 w-24 text-blue-500" /> 
        ) : (
          <FileText className="h-24 w-24 text-gray-500" />
        )}
        <p className="mt-4 text-lg font-medium text-center">{document.name}</p>
        <p className="mt-2 text-gray-500">Preview not available for this file type</p>
      </div>
    </div>
  );
};
