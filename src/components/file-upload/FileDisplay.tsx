
import React from 'react';
import { File, FileText, X } from 'lucide-react';

interface FileDisplayProps {
  file: File;
  uploading: boolean;
  removeFile: () => void;
  className?: string;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file, uploading, removeFile, className }) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-orange-400" />;
    if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('sheet')) 
      return <File className="h-8 w-8 text-orange-400" />;
    return <File className="h-8 w-8 text-orange-400" />;
  };
  
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg bg-white/80 ${className}`}>
      <div className="flex items-center space-x-3">
        {getFileIcon(file.type)}
        <div>
          <p className="font-medium truncate max-w-[200px] md:max-w-[400px] text-[#0EA5E9]">{file.name}</p>
          <p className="text-sm text-[#0EA5E9]/70">
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
