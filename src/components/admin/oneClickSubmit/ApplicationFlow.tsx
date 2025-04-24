
import React, { useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from "sonner"; // Add this import for toast notifications

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab, isLoading, error } = 
    useApplicationProgress(merchantApplication);
  
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Show error if application data couldn't be loaded
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border p-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load application</AlertTitle>
          <AlertDescription>
            There was an error loading the application data. Please try again or contact support.
          </AlertDescription>
        </Alert>
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors" 
            onClick={onClose}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
          resetDirtyState();
        }).catch(err => {
          console.error("Error saving application data:", err);
          setIsSaving(false);
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
      if (!merchantApplication?.id) {
        console.log("No application ID available, skipping save on unmount");
        return;
      }
      
      const currentValues = form.getValues();
      if (currentValues) {
        if (!currentValues.currentTab) {
          currentValues.currentTab = activeTab;
        }
        updateFormData(currentValues);
        saveApplicationData().catch(err => {
          console.error("Error saving on unmount:", err);
        });
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
      saveApplicationData().catch(err => {
        console.error("Error saving on tab change:", err);
      });
    }
  }, [activeTab, merchantApplication?.id]);

  const handleBankRouting = () => {
    const currentFormValues = form.getValues();
    if (!currentFormValues.currentTab) {
      currentFormValues.currentTab = activeTab;
    }
    updateFormData(currentFormValues);
    saveApplicationData().then(() => {
      setShowBankRouting(true);
    }).catch(err => {
      console.error("Error saving before bank routing:", err);
      toast.error("Failed to save data before bank routing");
    });
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
