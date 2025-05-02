
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentUpload } from './hooks/useDocumentUpload';
import { FileList } from './FileList';
import { Button } from '@/components/ui/button';
import { FileCheck, Upload, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface DocumentUploadSectionProps {
  applicationId: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ applicationId }) => {
  const { uploading, documents, uploadDocument, loadDocuments } = useDocumentUpload(applicationId);
  const [activeTab, setActiveTab] = useState('bank');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    // Force document reload when component mounts
    if (applicationId) {
      console.log("DocumentUploadSection mounted, loading documents for:", applicationId);
      loadDocuments();
    }
  }, [applicationId, loadDocuments]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log('File selected:', e.target.files[0].name);
    } else {
      console.log('No file selected');
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('No file selected for upload');
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
        const fileInput = document.getElementById('documentFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        console.log('Upload completed, file input reset');
      }
    });
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
    { id: 'bank', label: 'Bank Statements' },
    { id: 'processing', label: 'Processing Statements' },
    { id: 'identity', label: 'Identity Documents' },
    { id: 'business', label: 'Business Documents' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Upload supporting documents for underwriting review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs sm:text-sm"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50">
                  <input
                    type="file"
                    id="documentFile"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="documentFile" className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <FileCheck className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedFile ? selectedFile.name : "Click to select a file"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, images and document files (max 10MB).
                      </p>
                    </div>
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </div>
                
                <FileList 
                  files={documentsByCategory[category.id]?.map(doc => ({
                    id: doc.id,
                    name: doc.file_name,
                    uploadDate: doc.created_at,
                    size: doc.file_size
                  })) || []}
                  onDelete={() => {}} // Will implement delete functionality later
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
