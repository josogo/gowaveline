
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentUpload } from '../hooks';
import { Button } from '@/components/ui/button';
import { FileCheck, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentCategories } from './DocumentCategories';
import { DocumentTabs } from './DocumentTabs';
import { DocumentViewModal } from '../documentViewer';

interface DocumentUploadSectionProps {
  applicationId: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ applicationId }) => {
  // Validate applicationId
  const validApplicationId = applicationId?.trim() || '';
  
  // Log for debugging
  console.log("[DocumentUploadSection] Rendering with applicationId:", validApplicationId || "NONE");
  
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
  } | null>(null);
  
  // Reload documents when component mounts or applicationId changes
  useEffect(() => {
    if (validApplicationId) {
      console.log("[DocumentUploadSection] Loading documents for:", validApplicationId);
      loadDocuments().catch(error => {
        console.error("[DocumentUploadSection] Error loading documents:", error);
      });
    } else {
      console.warn("[DocumentUploadSection] No applicationId provided");
    }
  }, [validApplicationId, loadDocuments]);
  
  const handleRefreshDocuments = () => {
    if (!validApplicationId) {
      toast.error("No application ID available");
      return;
    }
    
    console.log("[DocumentUploadSection] Manual document refresh requested for ID:", validApplicationId);
    loadDocuments().catch(error => {
      console.error("[DocumentUploadSection] Error refreshing documents:", error);
    });
    toast.info('Refreshing document list...');
  };
  
  const handleViewDocument = (doc: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
  }) => {
    console.log('[DocumentUploadSection] Opening document view:', doc);
    setViewingDocument(doc);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Upload supporting documents for underwriting review
            </CardDescription>
            {!validApplicationId && (
              <p className="text-amber-600 text-xs mt-1">
                No application ID detected. Documents may not be saved properly.
              </p>
            )}
          </div>
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
