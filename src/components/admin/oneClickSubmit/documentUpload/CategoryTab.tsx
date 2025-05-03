
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentUpload } from '../hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadForm } from './UploadForm';
import { DocumentList } from './DocumentList';
import { Loader2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryTabProps {
  title: string;
  documentTypes: Array<{value: string, label: string}>;
  applicationId: string;
  onViewDocument: (doc: any) => void;
  isLoading: boolean;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  title,
  documentTypes,
  applicationId,
  onViewDocument,
  isLoading
}) => {
  const { documents } = useDocumentUpload(applicationId);
  
  // Group documents by type for this category
  const categoryDocuments = useMemo(() => {
    if (!documents) return {};
    
    const result: Record<string, any[]> = {};
    
    documentTypes.forEach(type => {
      result[type.value] = documents.filter(doc => 
        (doc.document_type && doc.document_type === type.value) || 
        (doc.document_type === type.value)
      );
    });
    
    return result;
  }, [documents, documentTypes]);
  
  return (
    <div className="space-y-6">
      {/* First document type - main one for this category */}
      <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-slate-50 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium text-blue-800">{documentTypes[0]?.label || title}</CardTitle>
            {categoryDocuments[documentTypes[0]?.value]?.length > 0 && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                Uploaded ({categoryDocuments[documentTypes[0]?.value].length})
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <UploadForm 
            applicationId={applicationId} 
            documentType={documentTypes[0]?.value} 
          />
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : documents && documents.length > 0 ? (
            <DocumentList 
              documents={categoryDocuments[documentTypes[0]?.value] || []} 
              onViewDocument={onViewDocument}
            />
          ) : (
            <Alert className="bg-blue-50 text-blue-700 border-blue-200">
              <AlertDescription className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                No {documentTypes[0]?.label || 'documents'} have been uploaded yet.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Additional document types for this category */}
      {documentTypes.slice(1).map((docType) => (
        <Card key={docType.value} className="overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardHeader className="bg-slate-50 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md font-medium text-blue-800">{docType.label}</CardTitle>
              {categoryDocuments[docType.value]?.length > 0 && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                  Uploaded ({categoryDocuments[docType.value].length})
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <UploadForm 
              applicationId={applicationId}
              documentType={docType.value}
            />
            
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : documents && documents.length > 0 ? (
              <DocumentList 
                documents={categoryDocuments[docType.value] || []}
                onViewDocument={onViewDocument}
              />
            ) : (
              <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                <AlertDescription className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  No {docType.label} have been uploaded yet.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
