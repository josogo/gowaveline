
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentUpload } from './hooks/useDocumentUpload';
import { FileList } from './FileList';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileCheck, Upload, Loader2, FileX } from 'lucide-react';
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
  
  useEffect(() => {
    // Force document reload when component mounts
    if (applicationId) {
      console.log("DocumentUploadSection mounted, loading documents for:", applicationId);
      loadDocuments();
    } else {
      console.warn("DocumentUploadSection mounted without applicationId");
    }
  }, [applicationId, loadDocuments]);
  
  // Reset selected file when upload completes or fails
  useEffect(() => {
    if (!uploading && uploadProgress === 0) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [uploading, uploadProgress]);
  
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
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    console.log(`Uploading file ${selectedFile.name} for category ${activeTab}`);
    await uploadDocument({
      file: selectedFile,
      applicationId,
      documentType: activeTab,
      onSuccess: () => {
        setSelectedFile(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        console.log('Upload completed, file input reset');
      },
      onError: (error) => {
        console.error('Upload error:', error);
        // We already reset the state in the hook's finally block
      }
    });
  };
  
  const handleCancelUpload = () => {
    // Cancel the current upload
    resetUploadState();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Group documents by category
  const documentsByCategory = React.useMemo(() => {
    const result: Record<string, any[]> = {
      bank: [],
      processing: [],
      identity: [],
      business: []
    };
    
    if (documents) {
      documents.forEach(doc => {
        const category = doc.document_type || 'other';
        if (!result[category]) {
          result[category] = [];
        }
        result[category].push(doc);
      });
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
    console.log('Viewing document:', doc);
    setViewingDocument(doc);
  };
  
  // Determine if upload is in error state
  const isUploadError = uploadError !== null;
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-blue-700 flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload supporting documents for underwriting review
        </CardDescription>
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
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:border-primary/50 ${
                    selectedFile ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <input
                    type="file"
                    id="documentFile"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    disabled={uploading}
                  />
                  <label htmlFor="documentFile" className="block cursor-pointer">
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
                  <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {uploadError?.message || 'An error occurred during upload'}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Progress bar for upload */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Uploading {selectedFile?.name}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress 
                      value={uploadProgress} 
                      className="h-2"
                      indicatorClassName={
                        uploadProgress < 30 ? "bg-amber-500" : 
                        uploadProgress < 70 ? "bg-blue-500" : 
                        "bg-green-500"
                      }
                    />
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  {uploading && (
                    <Button
                      variant="outline"
                      onClick={handleCancelUpload}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <FileX className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleUpload}
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
                  onDelete={() => {}} // Will implement delete functionality later
                  onView={handleViewDocument}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Document view modal - fixed issue with incorrect prop name */}
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
