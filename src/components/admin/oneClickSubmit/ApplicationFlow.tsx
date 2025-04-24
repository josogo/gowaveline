
import React, { useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

// Import hooks
import { useApplicationForm } from './hooks/useApplicationForm';
import { useApplicationProgress } from './hooks/useApplicationProgress';
import { useApplicationActions } from './hooks/useApplicationActions';
import { useApplicationNavigation } from './hooks/useApplicationNavigation';
import { useApplicationTabs } from './hooks/useApplicationTabs';

// Import components
import { SendToMerchantDialog } from './SendToMerchantDialog';
import { ApplicationHeader } from './components/ApplicationHeader';
import { ApplicationContent } from './components/ApplicationContent';
import { NavigationControls } from './components/NavigationControls';
import BankRoutingSystem from './bankRouting/BankRoutingSystem';

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
  const { form, formData, updateFormData, isDirty, resetDirtyState } = useApplicationForm(merchantApplication);
  
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab } = 
    useApplicationProgress(merchantApplication);
  
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);

  // Initialize currentTab in form when activeTab changes
  useEffect(() => {
    if (activeTab) {
      form.setValue('currentTab', activeTab);
      console.log(`Set currentTab value to ${activeTab} in form`);
    }
  }, [activeTab, form]);

  const { saveApplicationData, handleSendToMerchant } = useApplicationActions(
    merchantApplication?.id,
    formData,
    applicationProgress,
    activeTab,
    setShowSendDialog
  );

  const { handleTabChange, navigateTab } = useApplicationNavigation(
    form,
    updateFormData,
    saveApplicationData,
    setActiveTab,
    setApplicationProgress
  );

  // Save data when form is dirty
  useEffect(() => {
    if (isDirty) {
      const saveTimeout = setTimeout(() => {
        // Make sure currentTab is set before saving
        const currentValues = form.getValues();
        if (!currentValues.currentTab) {
          currentValues.currentTab = activeTab;
          form.setValue('currentTab', activeTab);
        }
        
        saveApplicationData();
        resetDirtyState();
        console.log("Auto-saving application data due to changes");
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [isDirty, saveApplicationData, resetDirtyState, form, activeTab]);

  const handleBankRouting = () => {
    const currentFormValues = form.getValues();
    if (!currentFormValues.currentTab) {
      currentFormValues.currentTab = activeTab;
    }
    updateFormData(currentFormValues);
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
        
        <FormProvider {...form}>
          <ApplicationContent 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          
          <NavigationControls
            currentTabIndex={tabs.findIndex(tab => tab.id === activeTab)}
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
