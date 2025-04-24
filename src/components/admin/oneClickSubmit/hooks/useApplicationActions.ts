
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
    
    // Save formData to localStorage for persistence between page refreshes
    try {
      const dataToSave = {
        formData,
        progress,
        activeTab,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(`application_${applicationId}`, JSON.stringify(dataToSave));
      
      // In a real app, this would also call an API endpoint to save to the database
      // For example: return api.updateMerchantApplication(applicationId, formData);
      
      console.log("Application data saved successfully to localStorage");
      return { success: true };
    } catch (error) {
      console.error("Error saving application data:", error);
      toast.error("Failed to save progress");
      return { success: false, error };
    }
  }, [applicationId, formData, progress, activeTab]);

  const handleSendToMerchant = useCallback(() => {
    // First save current state
    const saveResult = saveApplicationData();
    
    // Only proceed if save was successful
    if (saveResult?.success && setShowSendDialog) {
      setShowSendDialog(true);
    }
  }, [saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
};
