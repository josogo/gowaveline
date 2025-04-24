
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useAutoSave = (
  isDirty: boolean,
  form: UseFormReturn<any>,
  activeTab: string,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>,
  resetDirtyState: () => void,
  setIsSaving: (saving: boolean) => void
) => {
  useEffect(() => {
    if (isDirty) {
      const saveTimeout = setTimeout(() => {
        const currentValues = form.getValues();
        if (!currentValues.currentTab) {
          currentValues.currentTab = activeTab;
          form.setValue('currentTab', activeTab);
        }
        
        setIsSaving(true);
        saveApplicationData().then(() => {
          setIsSaving(false);
          resetDirtyState();
        });
        
        console.log("Auto-saving application data due to changes");
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [isDirty, saveApplicationData, resetDirtyState, form, activeTab, setIsSaving]);
};

