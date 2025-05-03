
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface DocumentFooterProps {
  documentUrl?: string;
  documentName?: string;
  onClose: () => void;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({ 
  documentUrl, 
  documentName, 
  onClose 
}) => {
  return (
    <div className="border-t p-4 flex items-center justify-end gap-2 bg-gray-50">
      {documentUrl && (
        <Button 
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          asChild
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
      
      <Button 
        variant="outline" 
        onClick={onClose}
      >
        <X className="h-4 w-4 mr-1.5" />
        Close
      </Button>
    </div>
  );
};
