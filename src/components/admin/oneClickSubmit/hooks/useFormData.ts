
import { useState, useCallback, useEffect } from 'react';

export function useFormData(initialData: any = {}) {
  const [formData, setFormData] = useState<any>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  // Update formData when initialData changes (e.g., when loading from API)
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      console.log("Initializing form data with:", initialData);
      setFormData(initialData);
    }
  }, [initialData]);

  const updateFormData = useCallback((newData: any) => {
    console.log("Updating form data with:", newData);
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      console.log("Updated form data:", updatedData);
      setIsDirty(true);
      return updatedData;
    });
  }, []);

  const resetDirtyState = useCallback(() => {
    setIsDirty(false);
  }, []);

  return { formData, updateFormData, isDirty, resetDirtyState };
}
