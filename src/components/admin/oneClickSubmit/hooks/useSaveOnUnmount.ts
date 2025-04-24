
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useSaveOnUnmount = (
  form: UseFormReturn<any>,
  merchantApplicationId: string | undefined,
  activeTab: string,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>
) => {
  useEffect(() => {
    return () => {
      console.log("Saving on unmount");
      const currentValues = form.getValues();
      if (currentValues && merchantApplicationId) {
        if (!currentValues.currentTab) {
          currentValues.currentTab = activeTab;
        }
        updateFormData(currentValues);
        saveApplicationData().catch(console.error);
      }
    };
  }, [form, updateFormData, saveApplicationData, activeTab, merchantApplicationId]);
};

