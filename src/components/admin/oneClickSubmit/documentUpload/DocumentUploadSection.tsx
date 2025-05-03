
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useDocumentUpload } from '../hooks';
import { Button } from '@/components/ui/button';
import { FileCheck, RefreshCw, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentCategories } from './DocumentCategories';
import { DocumentTabs } from './DocumentTabs';
import { DocumentViewModal } from '../documentViewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface DocumentUploadSectionProps {
  applicationId: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ applicationId }) => {
  // Validate applicationId
  const validApplicationId = applicationId?.trim() || '';
  
  const { 
    uploading, 
    documents, 
    isLoading,
    loadDocuments,
  } = useDocumentUpload(validApplicationId);
  
  const [activeTab, setActiveTab] = useState('bank');
  const [viewingDocument, setViewingDocument] = useState<{
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
    url?: string;
  } | null>(null);
  
  // Reload documents when component mounts or applicationId changes
  useEffect(() => {
    if (validApplicationId) {
      loadDocuments().catch(error => {
        console.error("[DocumentUploadSection] Error loading documents:", error);
        toast.error("Failed to load documents");
      });
    }
  }, [validApplicationId, loadDocuments]);
  
  const handleRefreshDocuments = () => {
    if (!validApplicationId) {
      toast.error("No application ID available");
      return;
    }
    
    toast.info('Refreshing document list...');
    loadDocuments().catch(error => {
      console.error("[DocumentUploadSection] Error refreshing documents:", error);
      toast.error("Failed to refresh documents");
    });
  };
  
  const handleViewDocument = (doc: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
    url?: string;
  }) => {
    setViewingDocument(doc);
  };

  const documentCount = documents?.length || 0;
  
  return (
    <Card className="shadow-md border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Document Center
            </CardTitle>
            <CardDescription>
              Upload supporting documents for underwriting review
            </CardDescription>
            {!validApplicationId && (
              <Alert variant="warning" className="mt-2 bg-amber-50 text-amber-800 border border-amber-200">
                <AlertDescription className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  No application ID detected. Documents may not save properly.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex items-center gap-2">
            {documentCount > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                {documentCount} document{documentCount !== 1 ? 's' : ''}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshDocuments}
              disabled={isLoading || !validApplicationId}
              className="flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <DocumentCategories activeTab={activeTab} />
          
          <DocumentTabs
            activeTab={activeTab}
            applicationId={validApplicationId}
            onViewDocument={handleViewDocument}
            isLoading={isLoading}
          />
        </Tabs>

        {/* Document view modal */}
        <DocumentViewModal 
          open={!!viewingDocument}
          onOpenChange={(open) => {
            if (!open) setViewingDocument(null);
          }}
          document={viewingDocument}
        />
      </CardContent>
    </Card>
  );
};
