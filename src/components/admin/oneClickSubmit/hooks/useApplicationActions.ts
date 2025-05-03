
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { anySupabase } from "@/utils/supabaseHelpers";

export const useApplicationActions = (
  applicationId?: string,
  formData?: any,
  progress?: number,
  activeTab?: string,
  setShowSendDialog?: (show: boolean) => void
) => {
  // Create a ref to track if save operations are in progress
  const savingRef = useRef(false);

  const saveApplicationData = useCallback(async (): Promise<void> => {
    if (!applicationId || !formData) {
      console.log("Unable to save: missing applicationId or formData");
      return Promise.reject(new Error("Missing applicationId or formData"));
    }
    
    // Prevent multiple simultaneous save operations
    if (savingRef.current) {
      console.log("Save operation already in progress, skipping duplicate save");
      return Promise.resolve(); // Return resolved promise to prevent further issues
    }
    
    savingRef.current = true;
    console.log("Saving application data:", { applicationId, formData, progress, activeTab });
    
    try {
      // Ensure we're capturing all the form data for special tabs
      if (activeTab === 'operations') {
        console.log('Saving operations tab with data:', formData.operations);
      }
      
      if (activeTab === 'financial') {
        console.log('Saving financial tab with data:', formData.financial);
      }
      
      if (activeTab === 'processing') {
        console.log('Saving processing tab with data:', formData.processing);
      }
      
      const dataToSave = {
        formData,
        progress,
        activeTab,
        lastUpdated: new Date().toISOString(),
      };
      
      // First save to localStorage for quick access and offline support
      localStorage.setItem(`application_${applicationId}`, JSON.stringify(dataToSave));
      console.log("Saved to localStorage:", dataToSave);
      
      // Then save to database with a timeout
      const savePromise = Promise.race([
        anySupabase
          .from("merchant_applications")
          .update({ 
            application_data: formData,
            updated_at: new Date().toISOString()
          })
          .eq("id", applicationId),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Database save timed out")), 3000))
      ]);
      
      const { error } = await savePromise as any;
      
      if (error) {
        console.error("Error saving to database:", error);
        toast.error("Failed to save to database");
        // Still continue since we saved to localStorage
        throw error;
      } else {
        console.log("Application data saved successfully to both localStorage and database");
      }
    } catch (error) {
      console.error("Error saving application data:", error);
      toast.error("Failed to save progress");
      throw error; // Re-throw to be handled by caller if needed
    } finally {
      savingRef.current = false;
    }
  }, [applicationId, formData, progress, activeTab]);

  const handleSendToMerchant = useCallback(async () => {
    if (!applicationId) {
      toast.error("Cannot send: No application ID available");
      return;
    }
    
    try {
      await saveApplicationData();
      if (setShowSendDialog) {
        setShowSendDialog(true);
      }
    } catch (error) {
      console.error("Error saving before sending to merchant:", error);
      toast.error("Failed to prepare data for sending");
    }
  }, [applicationId, saveApplicationData, setShowSendDialog]);

  return { saveApplicationData, handleSendToMerchant };
};
