
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

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
import BankRoutingSystem from './bankRouting/BankRoutingSystem';
import { FormProvider, useForm } from 'react-hook-form';

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
  const form = useForm({
    defaultValues: {}
  });
  const { formData, updateFormData, isDirty, resetDirtyState } = useFormData();
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab } = 
    useApplicationProgress(merchantApplication);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize form data from merchant application
  useEffect(() => {
    if (merchantApplication?.application_data) {
      const initialData = {
        businessName: merchantApplication.merchant_name,
        businessEmail: merchantApplication.merchant_email,
        ...merchantApplication.application_data
      };
      updateFormData(initialData);
      form.reset(initialData);
      console.log("Initializing form data from merchant application:", initialData);
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(true);
    }
  }, [merchantApplication, updateFormData, form]);

  const { saveApplicationData, handleSendToMerchant } = useApplicationActions(
    merchantApplication?.id,
    formData,
    applicationProgress,
    activeTab,
    setShowSendDialog
  );

  // Save data when form is dirty
  useEffect(() => {
    if (isDirty && isDataLoaded) {
      const saveTimeout = setTimeout(() => {
        saveApplicationData();
        resetDirtyState();
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [isDirty, saveApplicationData, resetDirtyState, isDataLoaded]);

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const handleTabChange = (tabId: string) => {
    // Save current form data before changing tabs
    console.log("Saving application data before tab change from", activeTab, "to", tabId);
    
    // Get current form values and update the formData state
    const currentFormValues = form.getValues();
    updateFormData(currentFormValues);
    
    // Save to backend/storage
    saveApplicationData();
    
    // Change tab after saving
    setActiveTab(tabId);
    
    const newTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const progressPerStep = 100 / tabs.length;
    const newProgress = Math.ceil((newTabIndex + 1) * progressPerStep);
    setApplicationProgress(newProgress);
    
    // Show toast notification
    toast.success("Progress saved successfully");
  };

  const navigateTab = (direction: 'next' | 'prev') => {
    // Get current form values and update formData
    const currentFormValues = form.getValues();
    updateFormData(currentFormValues);
    
    // Save to backend
    saveApplicationData();
    
    if (direction === 'next' && currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id);
    } else if (direction === 'prev' && currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id);
    }
  };

  const handleBankRouting = () => {
    const currentFormValues = form.getValues();
    updateFormData(currentFormValues);
    saveApplicationData();
    setShowBankRouting(true);
  };

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }

  if (!isDataLoaded) {
    return <div className="flex items-center justify-center h-full">Loading application data...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all">
      <div className="h-[90vh] overflow-y-auto p-4 md:p-8">
        <ApplicationHeader onClose={onClose} progress={applicationProgress} />
        
        <FormProvider {...form}>
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
        </FormProvider>
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
