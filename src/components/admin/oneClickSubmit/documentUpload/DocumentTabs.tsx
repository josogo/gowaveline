import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { UploadForm } from './UploadForm';
import { FileList } from '../FileList';
import { DocumentViewItem } from '../hooks/documentUpload/types';
import { useDocumentUpload } from '../hooks';

interface DocumentTabsProps {
  activeTab: string;
  applicationId: string;
  onViewDocument: (document: DocumentViewItem) => void;
  isLoading: boolean;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({ 
  activeTab,
  applicationId,
  onViewDocument,
  isLoading
}) => {
  const { documents } = useDocumentUpload(applicationId);
  
  // Filter documents based on active tab
  const getDocumentsForTab = () => {
    if (!documents || !documents.length) return [];
    
    return documents.filter(doc => {
      const docType = doc.document_type;
      
      switch (activeTab) {
        case 'bank':
          return ['bank_statement', 'voided_check'].includes(docType);
        case 'business':
          return ['business_license', 'ein_letter', 'articles_of_incorporation'].includes(docType);
        case 'processing':
          return ['processing_statement'].includes(docType);
        case 'other':
          return !['bank_statement', 'voided_check', 'business_license', 'ein_letter',
                 'articles_of_incorporation', 'processing_statement'].includes(docType);
        default:
          return false;
      }
    }).map(doc => ({
      id: doc.id,
      name: doc.file_name || doc.name,
      uploadDate: doc.created_at || new Date().toISOString(),
      size: doc.file_size || doc.size,
      filePath: doc.file_path || '',
      fileType: doc.file_type || doc.type
    }));
  };
  
  // Get appropriate document type based on tab
  const getDefaultDocumentType = () => {
    switch (activeTab) {
      case 'bank': return 'bank_statement';
      case 'business': return 'business_license';
      case 'processing': return 'processing_statement';
      default: return 'other';
    }
  };
  
  return (
    <>
      <TabsContent value={activeTab} className="space-y-6">
        <UploadForm
          applicationId={applicationId}
          documentType={getDefaultDocumentType()}
        />
        
        <FileList
          files={getDocumentsForTab()}
          onDelete={() => {}} // We'll implement this later
          onView={onViewDocument}
          loading={isLoading}
        />
      </TabsContent>
    </>
  );
};

export default DocumentTabs;
