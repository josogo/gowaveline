
import { useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useApplicationActions(
  merchantAppId: any,
  formData: any,
  applicationProgress: number,
  activeTab: string,
  setShowSendDialog: (open: boolean) => void
) {

  // Save the current form data to the database
  const saveApplicationData = useCallback(async () => {
    if (!merchantAppId) {
      console.log("No merchantAppId, cannot save application data");
      return false;
    }
    
    try {
      console.log("Saving application data:", { formData, progress: applicationProgress, currentTab: activeTab });
      
      const applicationData = {
        ...formData,
        progress: applicationProgress,
        currentTab: activeTab,
      };
      
      const { error } = await supabase
        .from('merchant_applications')
        .update({
          application_data: applicationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantAppId);

      if (error) {
        console.error("Error saving application data:", error);
        return false;
      }

      console.log("Application data saved successfully");
      return true;
    } catch (err) {
      console.error("Exception saving application data:", err);
      return false;
    }
  }, [merchantAppId, formData, applicationProgress, activeTab]);

  // Send for completion
  const handleSendToMerchant = useCallback(() => {
    console.log("Attempting to send to merchant");
    saveApplicationData().then(saved => {
      if (saved) {
        console.log("Application saved, showing dialog");
        setShowSendDialog(true);
      } else {
        toast.error("Failed to save application before sending. Please try again.");
      }
    });
  }, [saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
}
