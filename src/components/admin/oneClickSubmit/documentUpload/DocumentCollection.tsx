
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { FileCheck, Folder, BarChart, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentUpload } from '../hooks';
import { DocumentViewModal } from '../documentViewer/DocumentViewModal';
import { DocumentViewItem } from '../hooks/documentUpload/types';
import { DocumentHeader, TabButton, TabContent } from './components';

interface DocumentCollectionProps {
  applicationId: string;
}

const DocumentCollection: React.FC<DocumentCollectionProps> = ({ applicationId }) => {
  const [activeTab, setActiveTab] = useState('bank');
  const [viewingDocument, setViewingDocument] = useState<DocumentViewItem | null>(null);
  const isTemporaryMode = applicationId.startsWith('temp_');
  
  const { loadDocuments, isLoading } = useDocumentUpload(applicationId);
  
  // Document category definitions
  const categories = React.useMemo(() => ({
    bank: {
      label: 'Banking',
      icon: <FileCheck className="h-4 w-4 mr-1.5" />,
      docTypes: ['bank_statement', 'voided_check'],
      defaultType: 'bank_statement'
    },
    business: {
      label: 'Business',
      icon: <FileText className="h-4 w-4 mr-1.5" />,
      docTypes: ['business_license', 'ein_letter', 'articles_of_incorporation'],
      defaultType: 'business_license'
    },
    processing: {
      label: 'Processing',
      icon: <BarChart className="h-4 w-4 mr-1.5" />,
      docTypes: ['processing_statement'],
      defaultType: 'processing_statement'
    },
    other: {
      label: 'Other',
      icon: <Folder className="h-4 w-4 mr-1.5" />,
      docTypes: ['other', 'website_terms', 'privacy_policy', 'contract'],
      defaultType: 'other'
    }
  }), []);
  
  // Load documents when component mounts or applicationId changes
  React.useEffect(() => {
    if (applicationId) {
      console.log(`[DocumentCollection] Loading documents for application: ${applicationId}`);
      loadDocuments().catch(error => {
        console.error("[DocumentCollection] Error loading documents:", error);
        // Only show toast for non-temporary IDs since temp may not have documents yet
        if (!isTemporaryMode) {
          toast.error("Failed to load documents");
        }
      });
    }
  }, [applicationId, loadDocuments, isTemporaryMode]);
  
  const refreshDocuments = () => {
    if (!applicationId) {
      toast.error("No application ID available");
      return;
    }
    
    toast.info('Refreshing document list...');
    loadDocuments().catch(error => {
      console.error("[DocumentCollection] Error refreshing documents:", error);
      toast.error("Failed to refresh documents");
    });
  };
  
  const handleViewDocument = (doc: DocumentViewItem) => {
    setViewingDocument(doc);
  };
  
  const handleCloseDocumentView = () => {
    setViewingDocument(null);
  };
  
  const handleDeleteDocument = async (doc: DocumentViewItem) => {
    toast("Delete functionality will be implemented in a future update");
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <DocumentHeader 
          isTemporaryMode={isTemporaryMode} 
          isLoading={isLoading} 
          onRefresh={refreshDocuments} 
        />
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              {Object.entries(categories).map(([key, category]) => (
                <TabButton 
                  key={key}
                  value={key} 
                  icon={category.icon}
                  label={category.label}
                  isActive={activeTab === key}
                />
              ))}
            </TabsList>
            
            <TabContent
              activeTab={activeTab}
              applicationId={applicationId}
              categoryConfig={categories[activeTab as keyof typeof categories]}
              onViewDocument={handleViewDocument}
              onUploadSuccess={refreshDocuments}
            />
          </Tabs>
        </CardContent>
      </Card>
      
      {viewingDocument && (
        <DocumentViewModal
          open={!!viewingDocument}
          onOpenChange={handleCloseDocumentView}
          document={viewingDocument}
          onDelete={handleDeleteDocument}
        />
      )}
    </div>
  );
};

export default DocumentCollection;
