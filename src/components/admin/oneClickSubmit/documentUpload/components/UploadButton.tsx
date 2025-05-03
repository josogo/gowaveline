
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Loader2 } from 'lucide-react';

interface UploadButtonProps {
  uploading: boolean;
  hasFile: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ uploading, hasFile }) => {
  if (!hasFile) return null;
  
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={!hasFile || uploading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FileUp className="h-4 w-4 mr-2" />
            Upload Document
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadButton;
