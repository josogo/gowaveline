
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
      console.log('Current form values on tab change:', currentValues);
      
      // Make sure current tab is set in the form data
      if (!currentValues.currentTab || currentValues.currentTab !== activeTab) {
        console.log(`Setting currentTab to ${activeTab}`);
        currentValues.currentTab = activeTab;
        form.setValue('currentTab', activeTab);
      }
      
      // For operations tab, ensure we have an operations object
      if (activeTab === 'operations') {
        if (!currentValues.operations) {
          console.log('Initializing empty operations object');
          currentValues.operations = {};
          form.setValue('operations', {});
        }
        console.log('Operations tab data on change:', currentValues.operations);
      }
      
      // For financial tab, ensure we have a financial object
      if (activeTab === 'financial') {
        if (!currentValues.financial) {
          console.log('Initializing empty financial object');
          currentValues.financial = {};
          form.setValue('financial', {});
        }
        console.log('Financial tab data on change:', currentValues.financial);
      }
      
      // For processing tab, ensure we have a processing object
      if (activeTab === 'processing') {
        if (!currentValues.processing) {
          console.log('Initializing empty processing object');
          currentValues.processing = {};
          form.setValue('processing', {});
        }
        console.log('Processing tab data on change:', currentValues.processing);
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
