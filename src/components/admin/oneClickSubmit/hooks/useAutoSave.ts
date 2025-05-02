
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useAutoSave = (
  isDirty: boolean,
  form: UseFormReturn<any>,
  activeTab: string | undefined,
  updateFormData: (data: any) => void,
  saveApplicationData: () => Promise<void>,
  resetDirtyState: () => void,
  setIsSaving?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);
  
  // Set up auto-save when form is dirty
  useEffect(() => {
    if (isDirty) {
      console.log('Form is dirty, setting up autosave timer...');
      
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set a new timer for auto-save (1.5 seconds after last change)
      autoSaveTimerRef.current = setTimeout(async () => {
        console.log('Auto-saving form data...');
        
        try {
          if (setIsSaving) setIsSaving(true);
          
          // Get the latest form values
          const currentValues = form.getValues();
          
          // Special handling for operations tab
          if (activeTab === 'operations') {
            const operationsData = form.getValues('operations');
            console.log('Auto-saving operations tab data:', operationsData);
            
            // Ensure the operations data isn't empty
            if (!operationsData) {
              console.log('No operations data found, initializing empty object');
              form.setValue('operations', {});
            }
          }
          
          // Special handling for financial tab
          if (activeTab === 'financial') {
            const financialData = form.getValues('financial');
            console.log('Auto-saving financial tab data:', financialData);
            
            // Ensure the financial data isn't empty
            if (!financialData) {
              console.log('No financial data found, initializing empty object');
              form.setValue('financial', {});
            }
          }
          
          // Make sure current tab is set
          if (activeTab && (!currentValues.currentTab || currentValues.currentTab !== activeTab)) {
            console.log(`Setting current tab to ${activeTab}`);
            currentValues.currentTab = activeTab;
            form.setValue('currentTab', activeTab);
          }
          
          // Update form data state 
          updateFormData(currentValues);
          
          // Save to localStorage and database
          await saveApplicationData();
          
          // Reset dirty state after successful save
          resetDirtyState();
          
          console.log('Auto-save completed successfully');
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          if (setIsSaving) setIsSaving(false);
        }
      }, 1500); // 1.5 second delay for responsive saving
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, form, activeTab, updateFormData, saveApplicationData, resetDirtyState, setIsSaving]);
};
