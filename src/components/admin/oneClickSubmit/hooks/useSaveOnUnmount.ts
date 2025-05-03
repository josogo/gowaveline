
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export const useSaveOnUnmount = (
  form: UseFormReturn<any>,
  merchantApplicationId: string | undefined,
  activeTab: string,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>
) => {
  // Create a ref to track if save is in progress
  const saveInProgressRef = useRef(false);
  
  useEffect(() => {
    return () => {
      // Only attempt to save if we have a valid application ID and no save is in progress
      if (!merchantApplicationId || saveInProgressRef.current) {
        console.log("Skip saving on unmount: No application ID available or save already in progress");
        return;
      }

      console.log("Saving on unmount");
      saveInProgressRef.current = true;
      
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
          
          // Fire and forget - don't block unmounting but limit the timeout
          const savePromise = Promise.race([
            saveApplicationData(), 
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Save timed out")), 2000)
            )
          ]);
          
          savePromise.catch(err => {
            console.error("Background save on unmount failed or timed out:", err);
            saveInProgressRef.current = false;
          }).finally(() => {
            saveInProgressRef.current = false;
          });
        }
      } catch (err) {
        console.error("Exception in useSaveOnUnmount:", err);
        saveInProgressRef.current = false;
      }
    };
  }, [form, updateFormData, saveApplicationData, activeTab, merchantApplicationId]);
};
