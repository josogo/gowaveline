
import React, { useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

// Import hooks
import { useApplicationForm } from './hooks/useApplicationForm';
import { useApplicationProgress } from './hooks/useApplicationProgress';
import { useApplicationActions } from './hooks/useApplicationActions';
import { useApplicationNavigation } from './hooks/useApplicationNavigation';
import { useApplicationTabs } from './hooks/useApplicationTabs';
import { useAutoSave } from './hooks/useAutoSave';
import { useFormSubscription } from './hooks/useFormSubscription';
import { useSaveOnTabChange } from './hooks/useSaveOnTabChange';
import { useSaveOnUnmount } from './hooks/useSaveOnUnmount';

// Import components
import { LoadingState } from './components/LoadingState';
import { SendToMerchantDialog } from './SendToMerchantDialog';
import { ApplicationHeader } from './components/ApplicationHeader';
import { ApplicationContent } from './components/ApplicationContent';
import { NavigationControls } from './components/NavigationControls';
import BankRoutingSystem from './bankRouting/BankRoutingSystem';
import { toast } from 'sonner';

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
  useScrollToTop(); // Ensure page scrolls to top when component mounts
  
  const tabs = useApplicationTabs();
  const { form, formData, updateFormData, isDirty, resetDirtyState } = useApplicationForm(merchantApplication);
  
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab, isLoading } = 
    useApplicationProgress(merchantApplication);
  
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeAttempted, setCloseAttempted] = useState(false);

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

  // Handle component close with proper saving
  const handleClose = async () => {
    if (onClose) {
      setIsClosing(true);
      setCloseAttempted(true);
      
      try {
        // Save data before closing
        const currentValues = form.getValues();
        updateFormData(currentValues);
        
        // Set a timeout to ensure we don't freeze indefinitely
        const saveTimeout = setTimeout(() => {
          console.log("Save operation timed out, closing anyway");
          setIsClosing(false);
          onClose();
        }, 3000); // 3 second timeout
        
        try {
          await saveApplicationData();
          clearTimeout(saveTimeout);
        } catch (error) {
          console.error("Error saving data before closing:", error);
          toast.error("Could not save all changes before closing");
          clearTimeout(saveTimeout);
        }
        
        // Call the onClose callback
        onClose();
      } catch (error) {
        console.error("Exception in close handler:", error);
        setIsClosing(false);
        toast.error("An error occurred while closing");
      } finally {
        setIsClosing(false);
      }
    }
  };

  // Force close if save takes too long
  useEffect(() => {
    let forceCloseTimeout: NodeJS.Timeout | null = null;
    
    if (isClosing && closeAttempted && onClose) {
      forceCloseTimeout = setTimeout(() => {
        console.log("Force closing after timeout");
        setIsClosing(false);
        onClose();
      }, 5000); // 5 seconds force close
    }
    
    return () => {
      if (forceCloseTimeout) {
        clearTimeout(forceCloseTimeout);
      }
    };
  }, [isClosing, closeAttempted, onClose]);

  // Use extracted hooks for side effects
  useFormSubscription(form, updateFormData);
  useAutoSave(isDirty, form, activeTab, updateFormData, saveApplicationData, resetDirtyState, setIsSaving);
  useSaveOnUnmount(form, merchantApplication?.id, activeTab, updateFormData, saveApplicationData);
  useSaveOnTabChange(activeTab, merchantApplication?.id, form, updateFormData, saveApplicationData);

  const handleBankRouting = async () => {
    const currentFormValues = form.getValues();
    if (!currentFormValues.currentTab) {
      currentFormValues.currentTab = activeTab;
    }
    updateFormData(currentFormValues);
    try {
      await saveApplicationData();
      setShowBankRouting(true);
    } catch (error) {
      console.error("Error preparing for bank routing:", error);
    }
  };

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const lastEdited = merchantApplication?.updated_at || new Date().toISOString();
  const applicationNumber = merchantApplication?.application_number || '';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all">
      <div className="h-[90vh] overflow-y-auto p-4 md:p-8">
        <ApplicationHeader 
          onClose={handleClose} 
          progress={applicationProgress} 
          isSaving={isSaving || isClosing}
          lastEdited={lastEdited}
          applicationNumber={applicationNumber}
        />
        
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
            readOnly={readOnly || isClosing}
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
