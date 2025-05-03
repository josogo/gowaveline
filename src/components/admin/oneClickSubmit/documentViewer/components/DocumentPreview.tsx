
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DocumentPreviewProps {
  documentUrl: string | null;
  documentFile: {
    id: string;
    name: string;
    filePath: string;
    fileType: string;
    uploadDate: string;
    size?: number;
  } | null;
  onError: () => void;
  onDownload: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentUrl,
  documentFile,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  
  if (!documentUrl || !documentFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Document unavailable</p>
      </div>
    );
  }

  const isPdf = documentFile.fileType?.includes('pdf');
  const isImage = documentFile.fileType?.includes('image');

  // For PDF files
  if (isPdf) {
    return (
      <div className="h-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <iframe 
          src={`${documentUrl}#toolbar=1`}
          className="w-full h-full"
          onLoad={() => setLoading(false)}
          onError={onError}
          title={documentFile.name}
        />
      </div>
    );
  }

  // For image files
  if (isImage) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <img 
          src={documentUrl} 
          alt={documentFile.name} 
          className="max-h-full max-w-full object-contain"
          onLoad={() => setLoading(false)}
          onError={onError}
        />
      </div>
    );
  }

  // For other file types
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <p className="text-lg font-medium mb-2">
        Preview not available for this file type
      </p>
      <p className="text-gray-500 mb-4">
        You can download this file to view its contents.
      </p>
    </div>
  );
};
