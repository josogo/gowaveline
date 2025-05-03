
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileCheck, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDocumentUpload } from '../hooks';
import { DocumentViewModal } from '../documentViewer/DocumentViewModal';
import { FileList } from '../FileList';
import { UploadForm } from './UploadForm';
import { DocumentViewItem } from '../hooks/documentUpload/types';

interface DocumentCollectionProps {
  applicationId: string;
}

export const DocumentCollection: React.FC<DocumentCollectionProps> = ({ applicationId }) => {
  const [activeTab, setActiveTab] = useState('bank');
  const [viewingDocument, setViewingDocument] = useState<DocumentViewItem | null>(null);
  
  const { 
    documents, 
    isLoading, 
    loadDocuments 
  } = useDocumentUpload(applicationId);
  
  // Load documents when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId) {
      loadDocuments().catch(error => {
        console.error("[DocumentCollection] Error loading documents:", error);
        toast.error("Failed to load documents");
      });
    }
  }, [applicationId, loadDocuments]);
  
  const refreshDocuments = () => {
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
  
  // Filter documents based on active tab
  const getDocumentsForTab = () => {
    if (!documents || !documents.length) return [];
    
    return documents.filter(doc => {
      switch (activeTab) {
        case 'bank':
          return ['bank_statement', 'voided_check'].includes(doc.document_type);
        case 'business':
          return ['business_license', 'ein_letter', 'articles_of_incorporation'].includes(doc.document_type);
        case 'processing':
          return ['processing_statement'].includes(doc.document_type);
        case 'other':
          return !['bank_statement', 'voided_check', 'business_license', 'ein_letter',
                 'articles_of_incorporation', 'processing_statement'].includes(doc.document_type);
        default:
          return false;
      }
    }).map(doc => ({
      id: doc.id,
      name: doc.file_name,
      uploadDate: doc.created_at,
      size: doc.file_size,
      filePath: doc.file_path,
      fileType: doc.file_type
    }));
  };
  
  if (!applicationId) {
    return (
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertDescription>
          Application ID is required to upload and view documents.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold text-blue-800">Document Collection</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshDocuments}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1">Refresh</span>
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="bank" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileCheck className="h-4 w-4 mr-1.5" />
                Banking
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileCheck className="h-4 w-4 mr-1.5" />
                Business
              </TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileCheck className="h-4 w-4 mr-1.5" />
                Processing
              </TabsTrigger>
              <TabsTrigger value="other" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileCheck className="h-4 w-4 mr-1.5" />
                Other
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              <UploadForm 
                applicationId={applicationId}
                documentType={
                  activeTab === 'bank' ? 'bank_statement' :
                  activeTab === 'business' ? 'business_license' :
                  activeTab === 'processing' ? 'processing_statement' : 'other'
                }
                onUploadSuccess={refreshDocuments}
              />
              
              <FileList
                files={getDocumentsForTab()}
                onDelete={() => {}} // We'll implement this later
                onView={handleViewDocument}
                loading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {viewingDocument && (
        <DocumentViewModal
          open={!!viewingDocument}
          onOpenChange={handleCloseDocumentView}
          document={viewingDocument}
        />
      )}
    </div>
  );
};

export default DocumentCollection;
