
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, className }) => {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    noClick: false,
    noKeyboard: false,
    preventDropOnDocument: true,
  });
  
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
      } bg-white ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadCloud className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            {isDragActive ? "Drop the file here" : "Drag & drop your merchant statement"}
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, CSV and Excel files (max 10MB).
          </p>
        </div>
        <Button 
          variant="outline" 
          className="bg-white text-primary border-primary hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (input) {
              input.click();
            }
          }}
        >
          Browse files
        </Button>
      </div>
    </div>
  );
};

export default DropZone;
