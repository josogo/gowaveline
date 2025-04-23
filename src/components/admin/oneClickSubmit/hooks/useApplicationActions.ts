
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
    if (!merchantAppId) return false;
    try {
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

      if (error) return false;

      return true;
    } catch {
      return false;
    }
  }, [merchantAppId, formData, applicationProgress, activeTab]);

  // Send for completion
  const handleSendToMerchant = useCallback(() => {
    saveApplicationData().then(saved => {
      if (saved) {
        setShowSendDialog(true);
      } else {
        toast.error("Failed to save application before sending. Please try again.");
      }
    });
  }, [saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
}
