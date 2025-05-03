
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Eye, File, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  documents: any[];
  onViewDocument: (doc: any) => void;
  isLoading?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onViewDocument,
  isLoading
}) => {
  if (!documents || documents.length === 0) {
    return (
      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertDescription>
          No documents have been uploaded yet.
        </AlertDescription>
      </Alert>
    );
  }

  const handleViewDocument = (doc: any) => {
    const publicUrl = supabase.storage.from('merchant-documents').getPublicUrl(doc.file_path).data.publicUrl;
    
    onViewDocument({
      id: doc.id,
      name: doc.file_name,
      uploadDate: doc.created_at,
      size: doc.file_size,
      filePath: doc.file_path,
      fileType: doc.file_type,
      url: publicUrl
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }
    if (fileType?.includes('image')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Uploaded Documents</h3>
      <div className="space-y-2">
        {documents.map(doc => (
          <Card key={doc.id} className="border-green-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  {getFileIcon(doc.file_type)}
                </div>
                <div>
                  <p className="font-medium truncate max-w-[150px] sm:max-w-[250px] md:max-w-[350px]">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Uploaded
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => handleViewDocument(doc)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
