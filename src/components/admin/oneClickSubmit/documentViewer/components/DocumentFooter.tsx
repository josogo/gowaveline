
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface DocumentFooterProps {
  documentFile: {
    fileType: string;
    uploadDate: string;
    name: string;
  } | null;
  isDownloading: boolean;
  downloadProgress: number;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({ 
  documentFile,
  isDownloading,
  downloadProgress
}) => {
  if (!documentFile) {
    return null;
  }

  const formattedDate = new Date(documentFile.uploadDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const getFileTypeLabel = (fileType: string) => {
    if (!fileType) return 'Unknown Type';
    if (fileType.includes('pdf')) return 'PDF Document';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('word')) return 'Word Document';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'Spreadsheet';
    return fileType.split('/')[1]?.toUpperCase() || 'Document';
  };
  
  return (
    <div className="border-t pt-2 text-sm text-gray-500 space-y-1">
      <div className="flex justify-between">
        <span>Type: {getFileTypeLabel(documentFile.fileType)}</span>
        <span>Uploaded: {formattedDate}</span>
      </div>
      
      {isDownloading && downloadProgress > 0 && (
        <div className="pt-1">
          <Progress 
            value={downloadProgress} 
            className="h-1"
            indicatorClassName="bg-blue-600"
          />
        </div>
      )}
    </div>
  );
};
