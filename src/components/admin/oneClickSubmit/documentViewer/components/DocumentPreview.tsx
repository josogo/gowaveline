
import React from 'react';
import { File, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DocumentPreviewProps {
  url: string;
  fileName: string;
  fileType: string;
  onLoad: () => void;
  onError: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  url,
  fileName,
  fileType,
  onLoad,
  onError
}) => {
  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <AlertCircle className="h-12 w-12 text-amber-400 mb-2" />
        <p className="font-medium text-gray-800">Document URL not available</p>
      </div>
    );
  }
  
  const isPdf = fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isImage = fileType?.startsWith('image/') || 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => fileName.toLowerCase().endsWith(`.${ext}`));
  
  if (isPdf) {
    return (
      <iframe 
        src={`${url}#view=FitH`}
        className="w-full h-full border-0" 
        onLoad={onLoad}
        onError={onError}
      />
    );
  }
  
  if (isImage) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 overflow-auto p-4">
        <img
          src={url}
          alt={fileName}
          className="max-w-full max-h-full object-contain"
          onLoad={onLoad}
          onError={onError}
        />
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {fileType?.includes('pdf') ? (
        <FileText className="h-16 w-16 text-red-300 mb-4" />
      ) : (
        <File className="h-16 w-16 text-blue-300 mb-4" />
      )}
      <h3 className="text-xl font-semibold mb-2">Preview Not Available</h3>
      <p className="text-muted-foreground text-center mb-6">
        This file type cannot be previewed directly in the browser.
      </p>
      
      <Button asChild>
        <a 
          href={url} 
          download={fileName}
          target="_blank" 
          rel="noreferrer"
        >
          <Download className="h-4 w-4 mr-2" />
          Download File
        </a>
      </Button>
    </div>
  );
};
