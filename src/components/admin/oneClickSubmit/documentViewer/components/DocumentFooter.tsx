
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';

interface DocumentFooterProps {
  document: {
    name: string;
    uploadDate: string;
    size: number;
    url?: string;
  };
  onDownload: () => void;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({
  document,
  onDownload
}) => {
  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="p-4 border-t bg-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-1.5" />
        <span>Uploaded: {formatDate(document.uploadDate)}</span>
        <span className="mx-2">•</span>
        <span>{formatSize(document.size)}</span>
      </div>
      
      <Button 
        onClick={onDownload}
        disabled={!document.url}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
};
