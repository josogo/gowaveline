
import React from 'react';

interface DocumentPreviewProps {
  documentUrl: string;
  documentType: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentUrl, documentType }) => {
  const isPdf = documentType.includes('pdf');
  const isImage = documentType.includes('image') || 
    documentType.includes('jpg') || 
    documentType.includes('jpeg') || 
    documentType.includes('png') ||
    documentType.includes('gif');
  
  if (isPdf) {
    return (
      <iframe 
        src={`${documentUrl}#toolbar=0&navpanes=0`}
        className="w-full h-full min-h-[600px]"
        title="PDF document"
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
