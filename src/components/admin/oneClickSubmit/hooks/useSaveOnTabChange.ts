
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useSaveOnTabChange = (
  activeTab: string,
  merchantApplicationId: string | undefined,
  form: UseFormReturn<any>,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>
) => {
  useEffect(() => {
    if (activeTab && merchantApplicationId) {
      const currentValues = form.getValues();
      if (!currentValues.currentTab) {
        currentValues.currentTab = activeTab;
        form.setValue('currentTab', activeTab);
      }
      updateFormData(currentValues);
      saveApplicationData();
    }
  }, [activeTab, merchantApplicationId, form, updateFormData, saveApplicationData]);
};

