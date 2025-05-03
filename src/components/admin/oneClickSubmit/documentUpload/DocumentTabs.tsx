
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { FileList } from '../FileList';
import { useDocumentUpload } from '../hooks';
import { UploadForm } from './UploadForm';
import { DocumentViewItem } from '../hooks/documentUpload/types';

interface DocumentTabsProps {
  activeTab: string;
  applicationId: string;
  onViewDocument: (doc: DocumentViewItem) => void;
  isLoading?: boolean;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  activeTab,
  applicationId,
  onViewDocument,
  isLoading = false
}) => {
  const { documents } = useDocumentUpload(applicationId);
  
  const getFilteredDocuments = (docType: string): DocumentViewItem[] => {
    if (!documents) return [];
    
    const filteredDocs = documents
      .filter(doc => {
        switch (docType) {
          case 'bank':
            return ['bank_statement', 'voided_check'].includes(doc.document_type);
          case 'business':
            return ['business_license', 'ein_letter', 'articles_of_incorporation'].includes(doc.document_type);
          case 'processing':
            return ['processing_statement', 'transaction_history'].includes(doc.document_type);
          case 'other':
            return !['bank_statement', 'voided_check', 'business_license', 'ein_letter', 
                    'articles_of_incorporation', 'processing_statement', 'transaction_history']
                    .includes(doc.document_type);
          default:
            return false;
        }
      })
      .map(doc => ({
        id: doc.id,
        name: doc.file_name,
        uploadDate: doc.created_at,
        size: doc.file_size,
        filePath: doc.file_path,
        fileType: doc.file_type
      }));
    
    return filteredDocs;
  };
  
  const handleDelete = async (id: string) => {
    // This will be handled by the useDocumentUpload hook from the parent
    console.log('Delete document:', id);
    // Future implementation could include document deletion functionality
  };
  
  // Document type mappings for upload forms
  const getDocTypeForTab = (tabName: string): string => {
    switch (tabName) {
      case 'bank':
        return 'bank_statement'; 
      case 'business':
        return 'business_license';
      case 'processing':
        return 'processing_statement';
      default:
        return 'other';
    }
  };
  
  return (
    <>
      {['bank', 'business', 'processing', 'other'].map(tabName => (
        <TabsContent key={tabName} value={tabName} className="space-y-6 mt-2">
          <div className="grid gap-6">
            <UploadForm 
              applicationId={applicationId}
              documentType={getDocTypeForTab(tabName)}
            />
            
            <FileList 
              files={getFilteredDocuments(tabName)}
              onDelete={handleDelete}
              onView={onViewDocument}
              loading={isLoading}
            />
          </div>
        </TabsContent>
      ))}
    </>
  );
};

export default DocumentTabs;
