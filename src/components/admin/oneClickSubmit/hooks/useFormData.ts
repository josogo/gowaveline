
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export function useFormData(initialData: any = {}) {
  const [formData, setFormData] = useState<any>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<any>(null);

  // Update formData when initialData changes (e.g., when loading from API)
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      console.log("Initializing form data with:", initialData);
      setFormData(initialData);
      setLastSavedData(JSON.stringify(initialData));
    }
  }, [initialData]);

  const updateFormData = useCallback((newData: any) => {
    if (!newData) return;
    
    console.log("Updating form data with:", newData);
    
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      // Check if data actually changed to avoid unnecessary dirty states
      const currentDataStr = JSON.stringify(updatedData);
      const previousDataStr = lastSavedData;
      
      // Deep comparison to detect actual changes
      if (previousDataStr !== currentDataStr) {
        console.log("Form data changed, marking as dirty");
        setIsDirty(true);
      }
      
      return updatedData;
    });
  }, [lastSavedData]);

  const resetDirtyState = useCallback(() => {
    setIsDirty(false);
    const currentDataStr = JSON.stringify(formData);
    setLastSavedData(currentDataStr);
    console.log("Form dirty state reset, data saved:", currentDataStr);
  }, [formData]);

  return { formData, updateFormData, isDirty, resetDirtyState };
}
