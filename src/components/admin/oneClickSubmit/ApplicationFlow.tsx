
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
import { Skeleton } from '@/components/ui/skeleton';
import DemoDataAlert from '@/components/dashboard/DemoDataAlert';

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
  
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab, isLoading } = 
    useApplicationProgress(merchantApplication);
  
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

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

  // Add form field change subscription to save data when fields change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Only trigger save on actual field changes, not on form initialization
      if (type === 'change') {
        console.log(`Field changed: ${name}`, value);
        updateFormData(value);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

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
        
        setIsSaving(true);
        saveApplicationData().then(() => {
          setIsSaving(false);
          setLastSavedAt(new Date());
          resetDirtyState();
        });
        
        console.log("Auto-saving application data due to changes");
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [isDirty, saveApplicationData, resetDirtyState, form, activeTab]);

  // Add a save on component unmount to ensure we save when navigating away
  useEffect(() => {
    return () => {
      console.log("Saving on unmount");
      const currentValues = form.getValues();
      if (currentValues && merchantApplication?.id) {
        if (!currentValues.currentTab) {
          currentValues.currentTab = activeTab;
        }
        updateFormData(currentValues);
        saveApplicationData();
      }
    };
  }, [form, updateFormData, saveApplicationData, activeTab, merchantApplication?.id]);

  // Force save when tab changes to ensure data persists
  useEffect(() => {
    if (activeTab && merchantApplication?.id) {
      const currentValues = form.getValues();
      if (!currentValues.currentTab) {
        currentValues.currentTab = activeTab;
        form.setValue('currentTab', activeTab);
      }
      updateFormData(currentValues);
      
      // Save after a short delay to ensure all form values are updated
      const saveTimeout = setTimeout(() => {
        setIsSaving(true);
        saveApplicationData().then(() => {
          setIsSaving(false);
          setLastSavedAt(new Date());
        });
      }, 300);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [activeTab, merchantApplication?.id, form, updateFormData, saveApplicationData]);

  const handleBankRouting = () => {
    const currentFormValues = form.getValues();
    if (!currentFormValues.currentTab) {
      currentFormValues.currentTab = activeTab;
    }
    updateFormData(currentFormValues);
    
    setIsSaving(true);
    saveApplicationData().then(() => {
      setIsSaving(false);
      setLastSavedAt(new Date());
      setShowBankRouting(true);
    });
  };

  const handleFieldChange = (name: string, value: any) => {
    form.setValue(name, value);
    const currentValues = form.getValues();
    updateFormData(currentValues);
  };

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all p-4 md:p-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      </div>
    );
  }

  // Use merchant application's updated_at as lastEdited, if available
  const lastEdited = merchantApplication?.updated_at || new Date().toISOString();
  const applicationNumber = merchantApplication?.application_number || '';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border animate-fade-in transition-all">
      <div className="h-[90vh] overflow-y-auto p-4 md:p-8">
        <ApplicationHeader 
          onClose={onClose} 
          progress={applicationProgress} 
          isSaving={isSaving}
          lastEdited={lastEdited}
          applicationNumber={applicationNumber}
          lastSavedAt={lastSavedAt}
        />
        
        <FormProvider {...form}>
          <ApplicationContent 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            onFieldChange={handleFieldChange}
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
