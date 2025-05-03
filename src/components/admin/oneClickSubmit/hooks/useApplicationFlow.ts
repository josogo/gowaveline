
import { useState, useEffect } from 'react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useApplicationForm } from './useApplicationForm';
import { useApplicationProgress } from './useApplicationProgress';
import { useApplicationActions } from './useApplicationActions';
import { useApplicationNavigation } from './useApplicationNavigation';
import { useFormSubscription } from './useFormSubscription';
import { useAutoSave } from './useAutoSave';
import { useSaveOnTabChange } from './useSaveOnTabChange';
import { useSaveOnUnmount } from './useSaveOnUnmount';

export const useApplicationFlow = (merchantApplication?: any, onClose?: () => void) => {
  useScrollToTop(); // Ensure page scrolls to top when component mounts
  
  // State management
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeAttempted, setCloseAttempted] = useState(false);

  // Core application hooks
  const { form, formData, updateFormData, isDirty, resetDirtyState } = useApplicationForm(merchantApplication);
  const { applicationProgress, setApplicationProgress, activeTab, setActiveTab, isLoading } = 
    useApplicationProgress(merchantApplication);

  // Initialize currentTab in form when activeTab changes
  useEffect(() => {
    if (activeTab) {
      form.setValue('currentTab', activeTab);
      console.log(`Set currentTab value to ${activeTab} in form`);
    }
  }, [activeTab, form]);

  // Application actions and navigation
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

  // Side effect hooks
  useFormSubscription(form, updateFormData);
  useAutoSave(isDirty, form, activeTab, updateFormData, saveApplicationData, resetDirtyState, setIsSaving);
  useSaveOnUnmount(form, merchantApplication?.id, activeTab, updateFormData, saveApplicationData);
  useSaveOnTabChange(activeTab, merchantApplication?.id, form, updateFormData, saveApplicationData);

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
          clearTimeout(saveTimeout);
        }
        
        // Call the onClose callback
        onClose();
      } catch (error) {
        console.error("Exception in close handler:", error);
        setIsClosing(false);
      } finally {
        setIsClosing(false);
      }
    }
  };

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

  return {
    // State
    showSendDialog,
    setShowSendDialog,
    showBankRouting,
    setShowBankRouting,
    isSaving,
    isClosing,
    isLoading,
    
    // Form and data
    form,
    formData,
    
    // UI state
    activeTab,
    applicationProgress,
    
    // Application data
    lastEdited: merchantApplication?.updated_at || new Date().toISOString(),
    applicationNumber: merchantApplication?.application_number || '',
    merchantApplication,
    
    // Actions and handlers
    handleClose,
    handleTabChange,
    navigateTab,
    handleSendToMerchant,
    handleBankRouting
  };
};
