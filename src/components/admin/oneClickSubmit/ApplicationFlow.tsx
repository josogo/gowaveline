
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
    defaultValues: merchantApplication?.application_data || {}
  });
  const { formData, updateFormData, isDirty, resetDirtyState } = useFormData(
    merchantApplication?.application_data || {}
  );
  
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
      
      console.log("Initializing form with data:", initialData);
      updateFormData(initialData);
      form.reset(initialData);
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
        console.log("Auto-saving application data due to changes");
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [isDirty, saveApplicationData, resetDirtyState, isDataLoaded]);

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const handleTabChange = (tabId: string) => {
    // Always save the current form values before changing tabs
    const currentFormValues = form.getValues();
    console.log("Saving data before tab change. Current values:", currentFormValues);
    
    // Update the formData state with current form values
    updateFormData(currentFormValues);
    
    // Force save to storage/backend
    saveApplicationData();
    
    // Change tab after saving
    setActiveTab(tabId);
    
    const newTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const progressPerStep = 100 / tabs.length;
    const newProgress = Math.ceil((newTabIndex + 1) * progressPerStep);
    setApplicationProgress(newProgress);
    
    toast.success("Progress saved successfully");
  };

  const navigateTab = (direction: 'next' | 'prev') => {
    // Always get latest form values 
    const currentFormValues = form.getValues();
    console.log(`Navigating ${direction}, saving current form values:`, currentFormValues);
    
    // Update formData and ensure it's saved
    updateFormData(currentFormValues);
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
