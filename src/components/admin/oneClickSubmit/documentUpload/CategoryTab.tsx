
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadForm } from './UploadForm';
import { DocumentList } from './DocumentList';
import { FileSearch } from 'lucide-react';

interface CategoryTabProps {
  title: string;
  documentTypes: Array<{ value: string; label: string }>;
  applicationId: string;
  onViewDocument: (doc: any) => void;
  isLoading: boolean;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  title,
  documentTypes,
  applicationId,
  onViewDocument,
  isLoading
}) => {
  const [activeDocType, setActiveDocType] = useState<string>(documentTypes[0]?.value || '');
  
  console.log(`[CategoryTab] ${title} rendering with applicationId: ${applicationId}, activeDocType: ${activeDocType}`);
  
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeDocType} onValueChange={setActiveDocType}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-6">
            {documentTypes.map(docType => (
              <TabsTrigger key={docType.value} value={docType.value}>
                {docType.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {documentTypes.map(docType => (
            <TabsContent key={docType.value} value={docType.value} className="space-y-6">
              <UploadForm
                applicationId={applicationId}
                documentType={docType.value}
              />
              
              <DocumentList
                applicationId={applicationId}
                documentType={docType.value}
                onViewDocument={onViewDocument}
                isLoading={isLoading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
