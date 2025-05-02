
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { CategoryTab } from './CategoryTab';

interface DocumentTabsProps {
  activeTab: string;
  applicationId: string;
  onViewDocument: (doc: {
    id: string;
    name: string;
    uploadDate: string;
    size: number;
    filePath: string;
    fileType: string;
  }) => void;
  isLoading: boolean;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  activeTab,
  applicationId,
  onViewDocument,
  isLoading
}) => {
  const categories = ['bank', 'processing', 'identity', 'business'];
  
  return (
    <>
      {categories.map(category => (
        <TabsContent key={category} value={category}>
          <CategoryTab 
            category={category}
            applicationId={applicationId}
            onViewDocument={onViewDocument}
            isLoading={isLoading}
          />
        </TabsContent>
      ))}
    </>
  );
};
