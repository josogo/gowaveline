
import React, { useEffect, useState } from 'react';
import { useDocumentUpload } from '../hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Loader2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  applicationId?: string;
  documentType?: string;
  documents?: any[];
  onViewDocument: (doc: any) => void;
  isLoading?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  applicationId,
  documentType,
  documents: propDocuments,
  onViewDocument,
  isLoading: globalIsLoading
}) => {
  const { documents: hookDocuments } = applicationId ? useDocumentUpload(applicationId) : { documents: undefined };
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  
  // Use provided documents or fetch them via the hook
  const documents = propDocuments || hookDocuments;
  
  // Filter documents by type if both documents and documentType are provided
  useEffect(() => {
    if (!documents) {
      setFilteredDocs([]);
      return;
    }
    
    if (documentType) {
      const filtered = documents.filter(doc => 
        doc.document_type === documentType
      ).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs([...documents].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    }
  }, [documents, documentType]);
  
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
  
  // Show loading state
  if (globalIsLoading) {
    return (
      <div className="flex justify-center items-center py-6 text-blue-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading documents...</span>
      </div>
    );
  }
  
  // Empty state
  if (filteredDocs.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No {documentType ? documentType.replace(/_/g, ' ') : ''} documents have been uploaded yet.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Document list
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Uploaded Documents</h3>
      {filteredDocs.map(doc => (
        <Card key={doc.id} className="border-green-100 hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{doc.file_name}</p>
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
  );
};
