
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { File, Trash2, FileText, Image, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileListProps {
  files: Array<{
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath?: string;
  }>;
  onDelete: (id: string) => void;
  onView?: (file: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
  }) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete, onView }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
        No documents uploaded yet
      </div>
    );
  }
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <Image className="h-8 w-8 text-blue-400" />;
    } else if (extension === 'pdf') {
      return <FileText className="h-8 w-8 text-red-400" />;
    }
    return <File className="h-8 w-8 text-gray-400" />;
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return `image/${extension}`;
    } else if (extension === 'pdf') {
      return 'application/pdf';
    }
    return 'application/octet-stream';
  };
  
  return (
    <div className="space-y-2">
      {files.map(file => (
        <div 
          key={file.id} 
          className="flex items-center justify-between p-3 border rounded-md bg-white hover:shadow-md transition-shadow"
        >
          <div 
            className="flex items-center flex-grow cursor-pointer"
            onClick={() => {
              if (onView && file.filePath) {
                onView({
                  ...file,
                  filePath: file.filePath,
                  fileType: getFileType(file.name)
                });
              }
            }}
          >
            {getFileIcon(file.name)}
            <div className="ml-3">
              <p className="font-medium text-sm">{file.name}</p>
              <div className="flex text-xs text-muted-foreground gap-2">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(file.uploadDate))} ago</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {onView && file.filePath && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onView({
                  ...file,
                  filePath: file.filePath,
                  fileType: getFileType(file.name)
                })}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-2"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(file.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
