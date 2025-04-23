
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useApplicationActions = (
  applicationId?: string,
  formData?: any,
  progress?: number,
  activeTab?: string,
  setShowSendDialog?: (show: boolean) => void
) => {
  const saveApplicationData = useCallback(() => {
    if (!applicationId || !formData) {
      console.log("Unable to save: missing applicationId or formData");
      return;
    }
    
    console.log("Saving application data:", { applicationId, formData, progress, activeTab });
    
    // In a real app, this would be an API call to save the data
    // For now, we'll simulate saving to localStorage
    localStorage.setItem(`application_${applicationId}`, JSON.stringify({
      formData,
      progress,
      activeTab,
      lastUpdated: new Date().toISOString(),
    }));
    
    // Simulate success
    console.log("Application data saved successfully");
    
    // Note: In production, this would be an actual API call:
    // return api.saveApplication(applicationId, formData);
  }, [applicationId, formData, progress, activeTab]);

  const handleSendToMerchant = useCallback(() => {
    // First save current state
    saveApplicationData();
    
    // Then show send dialog
    if (setShowSendDialog) {
      setShowSendDialog(true);
    }
  }, [saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
};
