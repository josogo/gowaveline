
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, X } from 'lucide-react';

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
import { ApplicationProgressBar } from './ApplicationProgressBar';

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
  const { saveApplicationData, handleSendToMerchant } = 
    useApplicationActions(
      merchantApplication?.id,
      formData,
      applicationProgress,
      activeTab,
      setShowSendDialog
    );

  // Initialize form data from merchant application if available
  useEffect(() => {
    if (merchantApplication?.application_data) {
      updateFormData(merchantApplication.application_data);
    }
  }, [merchantApplication, updateFormData]);

  // Find current tab index
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    saveApplicationData();
    setActiveTab(tabId);
    
    // Update progress when changing tabs
    const newTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const progressPerStep = 100 / tabs.length;
    const newProgress = Math.ceil((newTabIndex + 1) * progressPerStep);
    setApplicationProgress(newProgress);
  };

  // Navigate to next or previous tab
  const navigateTab = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id);
    } else if (direction === 'prev' && currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <ApplicationProgressBar progress={applicationProgress} />
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full flex overflow-x-auto mb-8">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex-1 min-w-max"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
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
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => navigateTab('prev')}
          disabled={currentTabIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentTabIndex === tabs.length - 1 ? (
            <Button onClick={handleSendToMerchant} disabled={readOnly}>
              <Send className="mr-2 h-4 w-4" />
              Send to Merchant
            </Button>
          ) : (
            <Button onClick={() => navigateTab('next')}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <SendToMerchantDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        applicationId={merchantApplication?.id}
        merchantEmail={merchantApplication?.merchant_email}
        merchantName={merchantApplication?.merchant_name}
      />
    </div>
  );
};

// Make sure to add the default export as well
export default ApplicationFlow;
