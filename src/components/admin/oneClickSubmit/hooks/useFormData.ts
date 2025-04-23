
import { useState, useCallback } from 'react';

export function useFormData() {
  const [formData, setFormData] = useState<any>({});

  const updateFormData = useCallback((newData: any) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  return { formData, updateFormData };
}
