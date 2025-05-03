
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

interface DocumentFooterProps {
  documentUrl?: string;
  documentName?: string;
  onDelete?: () => void;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({
  documentUrl,
  documentName,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
      {documentUrl && (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="text-blue-600 hover:text-blue-700"
        >
          <a
            href={documentUrl}
            download={documentName}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </a>
        </Button>
      )}
      
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default DocumentFooter;
