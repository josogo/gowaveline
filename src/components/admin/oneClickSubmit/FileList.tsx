
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { File, Trash2, FileText, Image, Eye, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface FileListProps {
  files: Array<{
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath?: string;
    fileType?: string;
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
  className?: string;
  loading?: boolean;
}

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  onDelete, 
  onView, 
  className,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center p-3 border rounded-lg">
            <Skeleton className="h-8 w-8 rounded mr-3" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full ml-2" />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-gray-50">
        <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500">No documents uploaded yet</p>
        <p className="text-sm text-gray-400">Upload documents above to get started</p>
      </div>
    );
  }
  
  const getFileIcon = (fileName: string, fileType?: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeType = fileType?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '') || mimeType.includes('image')) {
      return <Image className="h-8 w-8 text-blue-400" />;
    } else if (extension === 'pdf' || mimeType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-400" />;
    }
    return <File className="h-8 w-8 text-gray-400" />;
  };
  
  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const getFileType = (fileName: string, fileType?: string) => {
    if (fileType) return fileType;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return `image/${extension}`;
    } else if (extension === 'pdf') {
      return 'application/pdf';
    }
    return 'application/octet-stream';
  };

  const getFileDownloadUrl = (filePath: string) => {
    return supabase.storage.from('merchant-documents').getPublicUrl(filePath).data.publicUrl;
  };
  
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
      <div className="grid gap-3">
        {files.map(file => {
          const viewable = file.filePath && onView;
          const downloadUrl = file.filePath ? getFileDownloadUrl(file.filePath) : '';
          
          if (!file.name) {
            return (
              <div key={file.id} className="p-3 border rounded-lg bg-red-50">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>Invalid file data</span>
                </div>
              </div>
            );
          }
          
          return (
            <div 
              key={file.id} 
              className={cn(
                "flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors",
                viewable && "cursor-pointer"
              )}
              onClick={() => {
                if (viewable && file.filePath) {
                  onView({
                    ...file,
                    filePath: file.filePath,
                    fileType: getFileType(file.name, file.fileType)
                  });
                }
              }}
            >
              <div className="flex items-center flex-grow min-w-0">
                {getFileIcon(file.name, file.fileType)}
                <div className="ml-3 min-w-0">
                  <p className="font-medium text-sm truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex text-xs text-muted-foreground gap-2">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(file.uploadDate))} ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {viewable && file.filePath && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (file.filePath) {
                        onView({
                          ...file,
                          filePath: file.filePath,
                          fileType: getFileType(file.name, file.fileType)
                        });
                      }
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                )}

                {file.filePath && (
                  <a 
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </a>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
