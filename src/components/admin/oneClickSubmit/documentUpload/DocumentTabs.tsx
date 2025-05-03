
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { CategoryTab } from './CategoryTab';

interface DocumentTabsProps {
  activeTab: string;
  applicationId: string;
  onViewDocument: (doc: any) => void;
  isLoading: boolean;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  activeTab,
  applicationId,
  onViewDocument,
  isLoading
}) => {
  console.log("[DocumentTabs] Rendering with activeTab:", activeTab, "applicationId:", applicationId);
  
  return (
    <div className="mt-4">
      <TabsContent value="bank" className="mt-2">
        <CategoryTab
          title="Banking Documents"
          documentTypes={[
            { value: 'bank_statement', label: 'Bank Statement' },
            { value: 'voided_check', label: 'Voided Check' },
          ]}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="business" className="mt-2">
        <CategoryTab
          title="Business Documents"
          documentTypes={[
            { value: 'business_license', label: 'Business License' },
            { value: 'articles_of_incorporation', label: 'Articles of Incorporation' },
            { value: 'ein_letter', label: 'EIN Letter' },
          ]}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="processing" className="mt-2">
        <CategoryTab
          title="Processing Documents"
          documentTypes={[
            { value: 'processing_statement', label: 'Processing Statement' },
            { value: 'credit_card_receipts', label: 'Credit Card Receipts' },
          ]}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="other" className="mt-2">
        <CategoryTab
          title="Other Documents"
          documentTypes={[
            { value: 'identity_document', label: 'Identity Document' },
            { value: 'website_terms', label: 'Website Terms & Conditions' },
            { value: 'privacy_policy', label: 'Privacy Policy' },
            { value: 'other', label: 'Other Document' },
          ]}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
    </div>
  );
};
