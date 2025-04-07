
import React from 'react';
import { IndustryDocument } from './types';
import { 
  FileText, 
  File, 
  Download, 
  Trash2,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface DocumentsListProps {
  documents: IndustryDocument[];
  onDelete: (id: string) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ documents, onDelete }) => {
  const getFileIcon = (document: IndustryDocument) => {
    if (document.file_type === 'logo') {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    
    const fileExt = document.file_name.split('.').pop()?.toLowerCase();
    
    switch(fileExt) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDownload = async (document: IndustryDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('industry-files')
        .createSignedUrl(document.file_path, 60); // 60 seconds expiry
      
      if (error) throw error;
      
      // Create a temporary anchor and trigger download
      const link = window.document.createElement('a');
      link.href = data.signedUrl;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {documents.map((doc) => (
          <li key={doc.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(doc)}
              <div>
                <h3 className="text-sm font-medium text-gray-900">{doc.file_name}</h3>
                <p className="text-xs text-gray-500">
                  Added {formatDistanceToNow(new Date(doc.uploaded_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(doc.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
