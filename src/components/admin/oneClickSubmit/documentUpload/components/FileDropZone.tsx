
import React from 'react';
import { Upload } from 'lucide-react';

interface FileDropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  isDragging, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onClick
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      data-testid="file-drop-zone"
    >
      <Upload className="h-8 w-8 text-blue-500 mb-2" />
      <p className="text-blue-600 font-medium mb-1">Drag & drop or click to upload</p>
      <p className="text-gray-500 text-sm text-center">
        Supported formats: PDF, JPEG, PNG, DOC up to 10MB
      </p>
    </div>
  );
};

export default FileDropZone;
