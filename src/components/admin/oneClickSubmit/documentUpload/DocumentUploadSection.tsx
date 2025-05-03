
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentUpload } from '../hooks';
import { Button } from '@/components/ui/button';
import { FileCheck, RefreshCw, Loader2, Info, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentCategories } from './DocumentCategories';
import { DocumentTabs } from './DocumentTabs';
import { DocumentViewModal } from '../documentViewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
    uploadProgress,
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
      console.log(`[DocumentUploadSection] Loading documents for application: ${validApplicationId}`);
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
  
  const handleViewDocument = (doc: any) => {
    setViewingDocument(doc);
  };
  
  const handleCloseDocumentView = () => {
    setViewingDocument(null);
  };
  
  if (!validApplicationId) {
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
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>
                Upload and manage application documents
              </CardDescription>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshDocuments}
              disabled={isLoading || uploading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <DocumentCategories activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <DocumentTabs 
              activeTab={activeTab}
              applicationId={validApplicationId}
              onViewDocument={handleViewDocument}
              isLoading={isLoading}
            />
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

