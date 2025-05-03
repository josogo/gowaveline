
import React from 'react';
import { Button } from '@/components/ui/button';
import { File, X } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  uploading: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, uploading }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
      <div className="flex items-center space-x-3">
        <File className="h-8 w-8 text-blue-500" />
        <div>
          <p className="font-medium truncate max-w-[200px] md:max-w-[400px] text-blue-700">{file.name}</p>
          <p className="text-sm text-blue-500/80">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <Button 
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={uploading}
        className="text-gray-500 hover:text-red-500"
        aria-label="Remove file"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default FilePreview;
