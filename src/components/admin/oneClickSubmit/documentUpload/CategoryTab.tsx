
import React, { useState, useRef } from 'react';
import { useDocumentUpload } from '../hooks';
import { UploadForm } from './UploadForm';
import { FileList } from '../FileList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryTabProps {
  category: string;
  applicationId: string;
  onViewDocument: (doc: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
  }) => void;
  isLoading: boolean;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  category,
  applicationId,
  onViewDocument,
  isLoading
}) => {
  const { 
    documents
  } = useDocumentUpload(applicationId);

  // Group documents by category
  const documentsByCategory = React.useMemo(() => {
    const result: Record<string, any[]> = {
      bank: [],
      processing: [],
      identity: [],
      business: []
    };
    
    if (documents && documents.length > 0) {
      documents.forEach(doc => {
        const docCategory = doc.document_type || 'other';
        if (!result[docCategory]) {
          result[docCategory] = [];
        }
        result[docCategory].push(doc);
      });
      console.log("Documents grouped by category:", Object.keys(result).map(k => `${k}: ${result[k]?.length || 0}`));
    } else {
      console.log("No documents to group");
    }
    
    return result;
  }, [documents]);

  const handleDeleteDocument = async (documentId: string) => {
    // For future implementation
    toast.info('Delete functionality will be implemented soon');
  };

  return (
    <div className="space-y-6">
      <UploadForm 
        applicationId={applicationId}
        documentType={category}
      />
      
      {/* File list with improved styling */}
      <FileList 
        files={documentsByCategory[category]?.map(doc => ({
          id: doc.id,
          name: doc.file_name,
          uploadDate: doc.created_at,
          size: doc.file_size,
          filePath: doc.file_path,
          fileType: doc.file_type
        })) || []}
        onDelete={handleDeleteDocument}
        onView={onViewDocument}
        loading={isLoading}
      />

      {!isLoading && documentsByCategory[category]?.length === 0 && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No {category} documents have been uploaded yet. Upload your first document above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
