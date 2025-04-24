
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BusinessDetailsForm } from '../forms/BusinessDetailsForm';
import { OwnershipForm } from '../forms/OwnershipForm';
import { OperationalDetailsForm } from '../forms/OperationalDetailsForm';
import { MarketingForm } from '../forms/MarketingForm';
import { FinancialInfoForm } from '../forms/FinancialInfoForm';
import { ProcessingInfoForm } from '../forms/ProcessingInfoForm';
import { DocumentsForm } from '../forms/DocumentsForm';
import { ApplicationTabs } from './ApplicationTabs';

interface ApplicationContentProps {
  activeTab: string;
  handleTabChange: (tabId: string) => void;
}

export const ApplicationContent: React.FC<ApplicationContentProps> = ({
  activeTab,
  handleTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
      <ApplicationTabs activeTab={activeTab} />
      
      <div className="min-h-[60vh] pb-20">
        <TabsContent value="business">
          <BusinessDetailsForm />
        </TabsContent>
        
        <TabsContent value="ownership">
          <OwnershipForm />
        </TabsContent>
        
        <TabsContent value="operations">
          <OperationalDetailsForm />
        </TabsContent>
        
        <TabsContent value="marketing">
          <MarketingForm />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialInfoForm />
        </TabsContent>
        
        <TabsContent value="processing">
          <ProcessingInfoForm />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsForm />
        </TabsContent>
      </div>
    </Tabs>
  );
};
