
import React from 'react';
import { useFileUpload } from './hooks/useFileUpload';
import DropZone from './DropZone';
import FileDisplay from './FileDisplay';
import UploadProgress from './UploadProgress';
import UploadActions from './UploadActions';

type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

export interface FileUploadProps {
  contactInfo?: ContactInfo;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange?: (acceptedFiles: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  contactInfo,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024,
  onFilesChange
}) => {
  React.useEffect(() => {
    localStorage.removeItem('statementAnalysis');
  }, []);

  const {
    file,
    uploading,
    progress,
    onDrop,
    removeFile,
    handleAnalyze,
    handleSend
  } = useFileUpload({
    contactInfo,
    onFilesChange,
    maxSize,
    accept
  });
  
  return (
    <div className="w-full">
      {!file ? (
        <DropZone 
          onDrop={onDrop}
          accept={accept}
        />
      ) : (
        <div className="space-y-4">
          <FileDisplay 
            file={file} 
            uploading={uploading} 
            removeFile={removeFile} 
          />
          
          <UploadProgress progress={progress} uploading={uploading} />
          
          {!onFilesChange && (
            <UploadActions 
              uploading={uploading} 
              file={file} 
              onSend={handleSend} 
              onAnalyze={handleAnalyze}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
