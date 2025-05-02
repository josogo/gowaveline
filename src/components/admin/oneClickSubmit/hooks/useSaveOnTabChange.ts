
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export const useSaveOnTabChange = (
  activeTab: string,
  merchantApplicationId: string | undefined,
  form: UseFormReturn<any>,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>
) => {
  useEffect(() => {
    if (activeTab && merchantApplicationId) {
      console.log(`Tab changed to ${activeTab}, saving form data...`);
      
      const currentValues = form.getValues();
      // Make sure current tab is set in the form data
      if (!currentValues.currentTab) {
        currentValues.currentTab = activeTab;
        form.setValue('currentTab', activeTab);
      }
      
      // Update form data state
      updateFormData(currentValues);
      
      // Save data to localStorage and database
      saveApplicationData()
        .then(() => {
          console.log(`Form data saved on tab change to ${activeTab}`);
        })
        .catch(error => {
          console.error('Error saving data on tab change:', error);
          toast.error('Failed to save your changes when switching tabs');
        });
    }
  }, [activeTab, merchantApplicationId, form, updateFormData, saveApplicationData]);
};
