
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useFormSubscription = (
  form: UseFormReturn<any>,
  updateFormData: (data: any) => void
) => {
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change') {
        console.log(`Field changed: ${name}`, value);
        updateFormData(value);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);
};

