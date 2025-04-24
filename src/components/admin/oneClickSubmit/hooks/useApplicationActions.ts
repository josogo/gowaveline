
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
  const saveApplicationData = useCallback(async (): Promise<void> => {
    if (!applicationId || !formData) {
      console.log("Unable to save: missing applicationId or formData");
      return;
    }
    
    console.log("Saving application data:", { applicationId, formData, progress, activeTab });
    
    try {
      const dataToSave = {
        formData,
        progress,
        activeTab,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(`application_${applicationId}`, JSON.stringify(dataToSave));
      
      const { error } = await supabase
        .from("merchant_applications")
        .update({ 
          application_data: formData,
          updated_at: new Date().toISOString()
        })
        .eq("id", applicationId);
      
      if (error) {
        console.error("Error saving to database:", error);
        toast.error("Failed to save to database");
        // Still continue since we saved to localStorage
      }
      
      console.log("Application data saved successfully");
    } catch (error) {
      console.error("Error saving application data:", error);
      toast.error("Failed to save progress");
      throw error; // Re-throw to be handled by caller if needed
    }
  }, [applicationId, formData, progress, activeTab]);

  const handleSendToMerchant = useCallback(async () => {
    try {
      await saveApplicationData();
      if (setShowSendDialog) {
        setShowSendDialog(true);
      }
    } catch (error) {
      console.error("Error saving before sending to merchant:", error);
      toast.error("Failed to prepare data for sending");
    }
  }, [saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
};

