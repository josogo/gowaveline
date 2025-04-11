
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { BusinessStructureTab } from '../tabs/BusinessStructureTab';
import { BusinessInfoTab } from '../tabs/BusinessInfoTab';
import { PrincipalInfoTab } from '../tabs/PrincipalInfoTab';
import { BankingInfoTab } from '../tabs/BankingInfoTab';
import { ProcessingVolumeTab } from '../tabs/ProcessingVolumeTab';
import { PoliciesTab } from '../tabs/PoliciesTab';
import { EcommerceTab } from '../tabs/EcommerceTab';

interface FormTabsProps {
  activeTab: string;
  form: UseFormReturn<any>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  form,
  goToNextTab,
  goToPrevTab
}) => {
  return (
    <>
      <TabsContent value="structure">
        <BusinessStructureTab form={form} goToNextTab={goToNextTab} />
      </TabsContent>
      
      <TabsContent value="business">
        <BusinessInfoTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
      </TabsContent>
      
      <TabsContent value="principal">
        <PrincipalInfoTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
      </TabsContent>
      
      <TabsContent value="banking">
        <BankingInfoTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
      </TabsContent>
      
      <TabsContent value="volume">
        <ProcessingVolumeTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
      </TabsContent>
      
      <TabsContent value="policies">
        <PoliciesTab form={form} goToNextTab={goToNextTab} goToPrevTab={goToPrevTab} />
      </TabsContent>
      
      <TabsContent value="ecommerce">
        <EcommerceTab form={form} goToPrevTab={goToPrevTab} />
      </TabsContent>
    </>
  );
};
