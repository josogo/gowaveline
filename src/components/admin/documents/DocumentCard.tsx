
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Document } from './types';
import { FileText, File, Download, Trash2, Edit, Eye, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onFill: (document: Document) => void;
  isAdmin: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onView,
  onEdit,
  onFill,
  isAdmin,
}) => {
  const fileExt = document.file_path.split('.').pop()?.toLowerCase();
  
  const getFileIcon = () => {
    switch (fileExt) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-10 w-10 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <File className="h-10 w-10 text-green-600" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const getDocumentTypeBadge = () => {
    switch (document.document_type) {
      case 'template':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Template</Badge>;
      case 'contract':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Contract</Badge>;
      case 'preapp':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Pre-App</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Other</Badge>;
    }
  };
  
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 60);
      
      if (error) throw error;
      
      // Create a temporary anchor and trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 flex items-center space-x-4">
          <div className="bg-gray-50 p-3 rounded">
            {getFileIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {getDocumentTypeBadge()}
              
              {document.is_template && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Template</Badge>
              )}
            </div>
            
            <div className="flex items-center text-sm mt-1 text-gray-500">
              <span>{formatFileSize(document.file_size)}</span>
              <span className="mx-1">•</span>
              <span>Added {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t bg-gray-50 flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => onView(document)}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          
          {document.is_template && (
            <Button variant="ghost" size="sm" onClick={() => onFill(document)}>
              <Copy className="h-4 w-4 mr-1" /> Fill
            </Button>
          )}
          
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(document)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(document.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
