import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import forms
import { BusinessDetailsForm } from './forms/BusinessDetailsForm';
import { OwnershipForm } from './forms/OwnershipForm';
import { OperationalDetailsForm } from './forms/OperationalDetailsForm';
import { MarketingForm } from './forms/MarketingForm';
import { FinancialInfoForm } from './forms/FinancialInfoForm';
import { ProcessingInfoForm } from './forms/ProcessingInfoForm';
import { DocumentsForm } from './forms/DocumentsForm';

// Import hooks
import { useApplicationTabs } from './hooks/useApplicationTabs';
import { useApplicationProgress } from './hooks/useApplicationProgress';
import { useApplicationActions } from './hooks/useApplicationActions';
import { useFormData } from './hooks/useFormData';

// Import components
import { SendToMerchantDialog } from './SendToMerchantDialog';
import { ApplicationHeader } from './components/ApplicationHeader';
import { ApplicationTabs } from './components/ApplicationTabs';
import { NavigationControls } from './components/NavigationControls';

export type ApplicationFlowProps = {
  merchantApplication?: any;
  readOnly?: boolean;
  onClose?: () => void;
};

export const ApplicationFlow: React.FC<ApplicationFlowProps> = ({ 
  merchantApplication, 
  readOnly = false,
  onClose
}) => {
  const tabs = useApplicationTabs();
  const { formData, updateFormData } = useFormData();
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab } = 
    useApplicationProgress(merchantApplication);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);

  useEffect(() => {
    if (merchantApplication?.application_data) {
      const initialData = {
        businessName: merchantApplication.merchant_name,
        businessEmail: merchantApplication.merchant_email,
        ...merchantApplication.application_data
      };
      updateFormData(initialData);
      console.log("Initializing form data from merchant application:", initialData);
    }
  }, [merchantApplication, updateFormData]);

  const { saveApplicationData, handleSendToMerchant } = useApplicationActions(
    merchantApplication?.id,
    formData,
    applicationProgress,
    activeTab,
    setShowSendDialog
  );

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const handleTabChange = (tabId: string) => {
    console.log("Saving application data before tab change from", activeTab, "to", tabId);
    saveApplicationData();
    setActiveTab(tabId);
    
    const newTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const progressPerStep = 100 / tabs.length;
    const newProgress = Math.ceil((newTabIndex + 1) * progressPerStep);
    setApplicationProgress(newProgress);
  };

  const navigateTab = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id);
    } else if (direction === 'prev' && currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id);
    }
  };

  const handleBankRouting = () => {
    saveApplicationData();
    setShowBankRouting(true);
  };

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all">
      <div className="h-[90vh] overflow-y-auto p-4 md:p-8">
        <ApplicationHeader onClose={onClose} progress={applicationProgress} />
        
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
        
        <NavigationControls
          currentTabIndex={currentTabIndex}
          totalTabs={tabs.length}
          onNavigate={navigateTab}
          onSendToMerchant={handleSendToMerchant}
          onBankRouting={handleBankRouting}
          readOnly={readOnly}
        />
      </div>
      
      <SendToMerchantDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        applicationId={merchantApplication?.id}
        applicationData={formData}
        merchantEmail={merchantApplication?.merchant_email}
        merchantName={merchantApplication?.merchant_name}
      />
    </div>
  );
};

export default ApplicationFlow;
