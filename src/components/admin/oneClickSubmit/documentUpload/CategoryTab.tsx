
import React from 'react';
import { useDocumentUpload } from '../hooks';
import { UploadForm } from './UploadForm';
import { FileList } from '../FileList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  console.log(`CategoryTab rendering for ${category} with applicationId: ${applicationId}`);
  
  const { 
    documents,
    loadDocuments
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
        
        // Make sure the category exists in our result object
        if (!result[docCategory]) {
          result[docCategory] = [];
        }
        
        result[docCategory].push(doc);
      });
      console.log(`Documents grouped for ${category} category:`, 
                 result[category]?.length || 0, "documents found");
    } else {
      console.log(`No documents to group for ${category} category`);
    }
    
    return result;
  }, [documents, category]);

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // Find the document to get the file path
      const docToDelete = documents.find(doc => doc.id === documentId);
      
      if (!docToDelete) {
        toast.error("Document not found");
        return;
      }
      
      console.log("Deleting document:", docToDelete);
      
      // First delete from storage
      if (docToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from('merchant-documents')
          .remove([docToDelete.file_path]);
          
        if (storageError) {
          console.error("Error deleting from storage:", storageError);
          toast.error("Error removing file from storage");
          return;
        }
      }
      
      // Then delete the database entry
      const { error: dbError } = await supabase
        .from('merchant_documents')
        .delete()
        .eq('id', documentId);
        
      if (dbError) {
        console.error("Error deleting document record:", dbError);
        toast.error("Error removing document record");
        return;
      }
      
      toast.success("Document deleted successfully");
      
      // Refresh the document list
      loadDocuments();
      
    } catch (err) {
      console.error("Error in delete operation:", err);
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="space-y-6">
      <UploadForm 
        applicationId={applicationId}
        documentType={category}
      />
      
      {/* File list with improved styling */}
      <FileList 
        files={(documentsByCategory[category] || []).map(doc => ({
          id: doc.id,
          name: doc.file_name,
          uploadDate: doc.created_at,
          size: doc.file_size,
          filePath: doc.file_path,
          fileType: doc.file_type
        }))}
        onDelete={handleDeleteDocument}
        onView={onViewDocument}
        loading={isLoading}
      />

      {!isLoading && (!documentsByCategory[category] || documentsByCategory[category]?.length === 0) && (
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
