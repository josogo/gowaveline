
import React from 'react';
import { Label } from '@/components/ui/label';
import FileUpload from '@/components/file-upload';

interface UploadSectionProps {
  onFileChange: (acceptedFiles: File[]) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileChange }) => {
  return (
    <div className="space-y-2">
      <Label>Upload Document</Label>
      <FileUpload
        accept=".pdf,.doc,.docx"
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        onFilesChange={onFileChange}
      />
    </div>
  );
};
