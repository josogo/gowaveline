
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/file-upload/FileUpload';
import { FileList } from './FileList';

// Mock documents (replace with real data from API)
const mockDocuments = [
  { id: '1', name: 'Bank Statement - March 2025.pdf', category: 'bank', uploadDate: '2025-04-22', size: 1240000 },
  { id: '2', name: 'Processing Statement Q1.pdf', category: 'processing', uploadDate: '2025-04-20', size: 980000 },
  { id: '3', name: 'Driver License - John Smith.jpg', category: 'identity', uploadDate: '2025-04-19', size: 420000 }
];

interface DocumentUploadSectionProps {
  applicationId: string;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ applicationId }) => {
  const [activeTab, setActiveTab] = useState('bank');
  const [documents, setDocuments] = useState(mockDocuments);
  
  const handleFilesChange = (files: File[]) => {
    console.log('Files selected:', files);
    // In a real implementation, you would upload these files
  };
  
  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    // In a real implementation, you would delete from storage
  };
  
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
                <FileUpload
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                  onFilesChange={handleFilesChange}
                />
                
                <FileList 
                  files={documents.filter(doc => doc.category === category.id)}
                  onDelete={handleDeleteDocument}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
