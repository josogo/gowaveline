
import React from 'react';
import { File, FileText, X } from 'lucide-react';

interface FileDisplayProps {
  file: File;
  uploading: boolean;
  removeFile: () => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file, uploading, removeFile }) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-orange-500" />;
    if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('sheet')) 
      return <File className="h-8 w-8 text-teal-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        {getFileIcon(file.type)}
        <div>
          <p className="font-medium truncate max-w-[200px] md:max-w-[400px]">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <button 
        onClick={removeFile}
        className="p-1 rounded-full hover:bg-gray-100"
        disabled={uploading}
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

export default FileDisplay;
