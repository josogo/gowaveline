
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentUpload } from './hooks/useDocumentUpload';
import { FileList } from './FileList';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileCheck, Upload, Loader2, FileX, RefreshCw, Info, X } from 'lucide-react';
import { DocumentViewModal } from './DocumentViewModal';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploadSectionProps {
  applicationId: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ applicationId }) => {
  const { 
    uploading, 
    uploadProgress, 
    uploadError,
    documents, 
    isLoading,
    uploadDocument, 
    loadDocuments,
    resetUploadState
  } = useDocumentUpload(applicationId);
  
  const [activeTab, setActiveTab] = useState('bank');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reload documents when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId) {
      console.log("DocumentUploadSection: Loading documents for:", applicationId);
      loadDocuments();
    }
  }, [applicationId, loadDocuments]);
  
  // Reset selected file state when upload completes or errors
  useEffect(() => {
    if (!uploading && uploadProgress === 0) {
      console.log("Upload completed or reset, clearing selected file");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [uploading, uploadProgress]);
  
  // Debug log for upload state changes
  useEffect(() => {
    console.log(`Upload state: uploading=${uploading}, progress=${uploadProgress}, error=${uploadError ? 'yes' : 'no'}`);
  }, [uploading, uploadProgress, uploadError]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB.');
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
      console.log('File selected:', file.name, file.size);
    } else {
      setSelectedFile(null);
      console.log('File selection cleared or canceled');
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    console.log(`Starting upload for file ${selectedFile.name} in category ${activeTab}`);
    
    try {
      await uploadDocument({
        file: selectedFile,
        applicationId,
        documentType: activeTab,
        onSuccess: () => {
          console.log("Upload success callback triggered");
          setSelectedFile(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        onError: (error) => {
          console.error("Upload error callback triggered:", error);
          // Reset file input on error
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      });
    } catch (err) {
      console.error("Error during upload submission:", err);
      // Ensure we reset even if there's an exception
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleCancelUpload = () => {
    console.log("Upload canceled by user");
    resetUploadState();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRefreshDocuments = () => {
    console.log("Manual document refresh requested");
    loadDocuments();
    toast.info('Refreshing document list...');
  };
  
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
        const category = doc.document_type || 'other';
        if (!result[category]) {
          result[category] = [];
        }
        result[category].push(doc);
      });
      console.log("Documents grouped by category:", Object.keys(result).map(k => `${k}: ${result[k]?.length || 0}`));
    } else {
      console.log("No documents to group");
    }
    
    return result;
  }, [documents]);
  
  const categories = [
    { id: 'bank', label: 'Bank Statements', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'processing', label: 'Processing Statements', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'identity', label: 'Identity Documents', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'business', label: 'Business Documents', icon: <FileCheck className="h-4 w-4" /> }
  ];

  const handleViewDocument = (doc: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
  }) => {
    console.log('Opening document view:', doc);
    setViewingDocument(doc);
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    // For future implementation
    toast.info('Delete functionality will be implemented soon');
  };
  
  // Determine if upload is in error state
  const isUploadError = uploadError !== null;
  
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
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshDocuments}
            disabled={isLoading}
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
          <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-50">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs sm:text-sm flex items-center gap-1.5 py-2.5"
              >
                {category.icon}
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-6">
                <form onSubmit={handleUpload}>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                      uploading ? 'bg-blue-50/50 opacity-75 cursor-not-allowed' : 
                      selectedFile ? 'bg-blue-50 border-blue-300' : 'bg-white hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="file"
                      id={`documentFile-${category.id}`}
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      disabled={uploading}
                    />
                    <label 
                      htmlFor={`documentFile-${category.id}`} 
                      className={`block ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        {selectedFile ? (
                          <>
                            <FileCheck className="h-12 w-12 text-green-500 mb-2" />
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedFile.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB - Click to change file
                            </p>
                          </>
                        ) : (
                          <>
                            <FileCheck className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-lg font-semibold text-gray-800">
                              Click to select a file
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Supports PDF, images and document files (max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {/* Error state */}
                  {isUploadError && (
                    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200 mt-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 mt-1 mr-2" />
                        <div className="flex-1">
                          <AlertDescription>
                            {uploadError?.message || 'An error occurred during upload'}
                          </AlertDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-red-600" 
                          onClick={() => resetUploadState()}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                    </Alert>
                  )}
                  
                  {/* Progress bar for upload */}
                  {uploading && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Uploading {selectedFile?.name}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress 
                        value={uploadProgress} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    {uploading && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelUpload}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <FileX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className={`${
                        selectedFile 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {selectedFile ? 'Upload Document' : 'Select & Upload'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                
                {/* File list with improved styling */}
                <FileList 
                  files={documentsByCategory[category.id]?.map(doc => ({
                    id: doc.id,
                    name: doc.file_name,
                    uploadDate: doc.created_at,
                    size: doc.file_size,
                    filePath: doc.file_path,
                    fileType: doc.file_type
                  })) || []}
                  onDelete={handleDeleteDocument}
                  onView={handleViewDocument}
                  loading={isLoading}
                />

                {!isLoading && documentsByCategory[category.id]?.length === 0 && (
                  <Alert variant="default" className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      No {category.id} documents have been uploaded yet. Upload your first document above.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          ))}
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
