
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useDocumentUpload } from '../../hooks';
import { UploadForm } from '../UploadForm';
import DocumentsList from './DocumentsList';
import { DocumentViewItem } from '../../hooks/documentUpload/types';

interface TabContentProps {
  activeTab: string;
  applicationId: string;
  categoryConfig: {
    defaultType: string;
    docTypes: string[];
  };
  onViewDocument: (doc: DocumentViewItem) => void;
  onUploadSuccess: () => void;
}

export const TabContent: React.FC<TabContentProps> = ({ 
  activeTab,
  applicationId,
  categoryConfig,
  onViewDocument,
  onUploadSuccess
}) => {
  const { documents, isLoading } = useDocumentUpload(applicationId);
  
  const filteredDocuments = React.useMemo(() => {
    if (!documents || !documents.length) return [];
    
    return documents
      .filter(doc => {
        const docType = doc.document_type;
        return categoryConfig.docTypes.includes(docType);
      })
      .map(doc => ({
        id: doc.id,
        name: doc.file_name || doc.name,
        uploadDate: doc.created_at || new Date().toISOString(),
        size: doc.file_size || doc.size,
        filePath: doc.file_path || '',
        fileType: doc.file_type || doc.type,
        documentType: doc.document_type
      }));
  }, [documents, categoryConfig.docTypes]);

  return (
    <TabsContent value={activeTab} className="space-y-6">
      <UploadForm 
        applicationId={applicationId}
        documentType={categoryConfig.defaultType}
        onUploadSuccess={onUploadSuccess}
      />
      
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-500 flex items-center justify-between">
          <span>Uploaded Documents ({filteredDocuments.length})</span>
        </div>
        
        <DocumentsList
          documents={filteredDocuments}
          isLoading={isLoading}
          onViewDocument={onViewDocument}
        />
      </div>
    </TabsContent>
  );
};

export default TabContent;
