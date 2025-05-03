
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
  // Document type definitions
  const bankingDocumentTypes = [
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'voided_check', label: 'Voided Check' },
    { value: 'bank_letter', label: 'Bank Letter' },
  ];
  
  const businessDocumentTypes = [
    { value: 'business_license', label: 'Business License' },
    { value: 'articles_of_incorporation', label: 'Articles of Incorporation' },
    { value: 'ein_letter', label: 'EIN Letter' },
    { value: 'certificate_of_good_standing', label: 'Certificate of Good Standing' },
  ];
  
  const processingDocumentTypes = [
    { value: 'processing_statement', label: 'Processing Statement' },
    { value: 'credit_card_receipts', label: 'Credit Card Receipts' },
    { value: 'transaction_history', label: 'Transaction History' },
  ];
  
  const otherDocumentTypes = [
    { value: 'identity_document', label: 'Identity Document' },
    { value: 'website_terms', label: 'Website Terms & Conditions' },
    { value: 'privacy_policy', label: 'Privacy Policy' },
    { value: 'other', label: 'Other Document' },
  ];
  
  return (
    <div className="mt-4">
      <TabsContent value="bank" className="mt-2">
        <CategoryTab
          title="Banking Documents"
          documentTypes={bankingDocumentTypes}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="business" className="mt-2">
        <CategoryTab
          title="Business Documents"
          documentTypes={businessDocumentTypes}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="processing" className="mt-2">
        <CategoryTab
          title="Processing Documents"
          documentTypes={processingDocumentTypes}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="other" className="mt-2">
        <CategoryTab
          title="Other Documents"
          documentTypes={otherDocumentTypes}
          applicationId={applicationId}
          onViewDocument={onViewDocument}
          isLoading={isLoading}
        />
      </TabsContent>
    </div>
  );
};
