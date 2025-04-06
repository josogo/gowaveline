
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
  accept?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, className, accept }) => {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  // Convert the accept string prop to the format expected by react-dropzone
  const getAcceptObject = (acceptString?: string) => {
    if (!acceptString) {
      return {
        'application/pdf': ['.pdf'],
        'text/csv': ['.csv'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      };
    }
    
    const acceptObj: Record<string, string[]> = {};
    const types = acceptString.split(',').map(t => t.trim());
    
    types.forEach(type => {
      if (type.startsWith('.')) {
        // It's a file extension
        const ext = type;
        switch (ext) {
          case '.pdf':
            acceptObj['application/pdf'] = [ext];
            break;
          case '.doc':
          case '.docx':
            acceptObj['application/msword'] = ['.doc'];
            acceptObj['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
            break;
          case '.csv':
            acceptObj['text/csv'] = [ext];
            break;
          case '.xls':
            acceptObj['application/vnd.ms-excel'] = [ext];
            break;
          case '.xlsx':
            acceptObj['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = [ext];
            break;
          default:
            // For other extensions, use a generic approach
            acceptObj[`application/${ext.substring(1)}`] = [ext];
        }
      } else {
        // It's a MIME type
        const mime = type;
        let extension = '.file';
        
        if (mime.includes('pdf')) extension = '.pdf';
        else if (mime.includes('csv')) extension = '.csv';
        else if (mime.includes('excel') || mime.includes('spreadsheet')) extension = '.xlsx';
        else if (mime.includes('word') || mime.includes('document')) extension = '.doc';
        
        acceptObj[mime] = [extension];
      }
    });
    
    return acceptObj;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    maxFiles: 1,
    accept: getAcceptObject(accept),
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
            {isDragActive ? "Drop the file here" : "Drag & drop your file"}
          </p>
          <p className="text-sm text-muted-foreground">
            {accept ? `Supports ${accept} files` : "Supports PDF, CSV and Excel files"} (max 10MB).
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
