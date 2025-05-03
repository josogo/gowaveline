
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentFooterProps {
  url: string;
  fileName: string;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({ 
  url, 
  fileName 
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopyLink}
      >
        <Copy className="h-4 w-4 mr-1.5" />
        Copy Link
      </Button>
      
      <Button 
        size="sm" 
        asChild
      >
        <a 
          href={url} 
          download={fileName}
          target="_blank" 
          rel="noreferrer"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Download
        </a>
      </Button>
    </div>
  );
};
