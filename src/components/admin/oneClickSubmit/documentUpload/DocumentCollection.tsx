import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Folder, BarChart, FileText, Loader2, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDocumentUpload } from '../hooks';
import UploadForm from './UploadForm';
import { DocumentViewModal } from '../documentViewer/DocumentViewModal';
import { DocumentViewItem } from '../hooks/documentUpload/types';

interface DocumentCollectionProps {
  applicationId: string;
}

export const DocumentCollection: React.FC<DocumentCollectionProps> = ({ applicationId }) => {
  const [activeTab, setActiveTab] = useState('bank');
  const [viewingDocument, setViewingDocument] = useState<DocumentViewItem | null>(null);
  const isTemporaryMode = applicationId.startsWith('temp_');
  
  const { 
    documents, 
    isLoading, 
    loadDocuments,
    uploadDocument
  } = useDocumentUpload(applicationId);
  
  // Document category definitions
  const categories = useMemo(() => ({
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
  useEffect(() => {
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
  
  // Filter documents based on active tab
  const getDocumentsForCurrentTab = () => {
    if (!documents || !documents.length) return [];
    
    const currentCategory = categories[activeTab as keyof typeof categories];
    if (!currentCategory) return [];
    
    return documents
      .filter(doc => {
        const docType = doc.document_type;
        return currentCategory.docTypes.includes(docType);
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
  };

  const filteredDocuments = getDocumentsForCurrentTab();
  
  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-xl font-semibold">Document Collection</CardTitle>
            {isTemporaryMode && (
              <div className="mt-1 text-xs flex items-center text-amber-600 gap-1">
                <Info className="h-3 w-3" />
                <span>Documents are being stored temporarily.</span>
              </div>
            )}
          </div>
          
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
              {Object.entries(categories).map(([key, category]) => (
                <TabsTrigger 
                  key={key}
                  value={key} 
                  className="flex items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  {category.icon}
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              <UploadForm 
                applicationId={applicationId}
                documentType={categories[activeTab as keyof typeof categories]?.defaultType}
                onUploadSuccess={refreshDocuments}
              />
              
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  <span>Uploaded Documents ({filteredDocuments.length})</span>
                </div>
                
                {isLoading ? (
                  <div className="py-8 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading documents...</span>
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                    <Folder className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-gray-600 font-medium mb-1">No documents yet</h3>
                    <p className="text-gray-500 text-sm">
                      Upload a document using the form above
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredDocuments.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm cursor-pointer transition-shadow"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2.5 rounded-md ${
                            doc.fileType?.includes('pdf') ? 'bg-red-50 text-red-600' :
                            doc.fileType?.includes('image') ? 'bg-blue-50 text-blue-600' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.uploadDate).toLocaleDateString()} • {(doc.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FileCheck className="h-4 w-4" />
                          <span className="sr-only">View document</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
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
