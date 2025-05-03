
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export const useSaveOnUnmount = (
  form: UseFormReturn<any>,
  merchantApplicationId: string | undefined,
  activeTab: string,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>
) => {
  useEffect(() => {
    return () => {
      // Only attempt to save if we have a valid application ID
      if (!merchantApplicationId) {
        console.log("Skip saving on unmount: No application ID available");
        return;
      }

      console.log("Saving on unmount");
      
      try {
        const currentValues = form.getValues();
        if (currentValues) {
          if (!currentValues.currentTab) {
            currentValues.currentTab = activeTab;
          }
          
          // Update form data synchronously
          updateFormData(currentValues);
          
          // Use a synchronous localStorage save as a backup
          try {
            const dataToSave = {
              formData: currentValues,
              activeTab,
              lastUpdated: new Date().toISOString(),
            };
            
            localStorage.setItem(`application_${merchantApplicationId}`, JSON.stringify(dataToSave));
            console.log("Backup save to localStorage completed on unmount");
          } catch (storageErr) {
            console.error("Error saving to localStorage on unmount:", storageErr);
          }
          
          // Fire and forget - don't block unmounting
          saveApplicationData().catch(err => {
            console.error("Background save on unmount failed:", err);
          });
        }
      } catch (err) {
        console.error("Exception in useSaveOnUnmount:", err);
      }
    };
  }, [form, updateFormData, saveApplicationData, activeTab, merchantApplicationId]);
};
