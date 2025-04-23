
import { useState, useCallback } from 'react';

export function useFormData() {
  const [formData, setFormData] = useState<any>({});

  const updateFormData = useCallback((newData: any) => {
    console.log("Updating form data with:", newData);
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      console.log("Updated form data:", updatedData);
      return updatedData;
    });
  }, []);

  return { formData, updateFormData };
}
