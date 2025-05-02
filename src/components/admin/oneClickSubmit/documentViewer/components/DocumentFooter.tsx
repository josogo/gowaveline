
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatDate, getFileTypeDisplay } from '../utils/fileHelpers';

interface DocumentFooterProps {
  documentFile: {
    fileType?: string;
    uploadDate: string;
  } | null;
  isDownloading: boolean;
  downloadProgress: number;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({
  documentFile,
  isDownloading,
  downloadProgress
}) => {
  if (!documentFile) return null;

  return (
    <div className="py-3 space-y-1 border-t mt-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">File type:</span>
        <span className="font-medium">{getFileTypeDisplay(documentFile.name || '', documentFile.fileType)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Upload date:</span>
        <span className="font-medium">{formatDate(documentFile.uploadDate)}</span>
      </div>
      {isDownloading && downloadProgress > 0 && (
        <div className="w-full pt-2">
          <Progress value={downloadProgress} className="h-1.5" />
        </div>
      )}
    </div>
  );
};
