
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export const useApplicationActions = (
  applicationId?: string,
  formData?: any,
  progress?: number,
  activeTab?: string,
  setShowSendDialog?: (show: boolean) => void
) => {
  const saveApplicationData = useCallback(async () => {
    if (!applicationId || !formData) {
      console.log("Unable to save: missing applicationId or formData");
      return { success: false };
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
      
      // Also update the database record to ensure data persists server-side
      const { error } = await supabase
        .from("merchant_applications")
        .update({ 
          application_data: formData,
          updated_at: new Date().toISOString()
        })
        .eq("id", applicationId);
      
      if (error) {
        console.error("Error saving to database:", error);
        // Still return success if localStorage worked, since that's our primary save mechanism
        return { success: true, warning: "Saved locally but not to database" };
      }
      
      console.log("Application data saved successfully to localStorage and database");
      return { success: true };
    } catch (error) {
      console.error("Error saving application data:", error);
      toast.error("Failed to save progress");
      return { success: false, error };
    }
  }, [applicationId, formData, progress, activeTab]);

  const handleSendToMerchant = useCallback(() => {
    // First save current state
    saveApplicationData().then(saveResult => {
      // Only proceed if save was successful
      if (saveResult?.success && setShowSendDialog) {
        setShowSendDialog(true);
      }
    });
  }, [saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
};
