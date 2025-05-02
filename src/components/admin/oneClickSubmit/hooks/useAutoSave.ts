
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
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set a new timer for auto-save (3 seconds after last change)
      autoSaveTimerRef.current = setTimeout(async () => {
        console.log('Auto-saving form data...');
        
        try {
          if (setIsSaving) setIsSaving(true);
          
          // Get the latest form values
          const currentValues = form.getValues();
          
          // Make sure current tab is set
          if (activeTab && !currentValues.currentTab) {
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
      }, 3000); // 3 second delay for auto-save
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, form, activeTab, updateFormData, saveApplicationData, resetDirtyState, setIsSaving]);
};
