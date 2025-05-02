
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useFormSubscription = (
  form: UseFormReturn<any>,
  updateFormData: (data: any) => void
) => {
  // Subscribe to form changes
  useEffect(() => {
    // Add debug logging
    console.log('Setting up form subscription');
    
    const subscription = form.watch((formValues, { name, type }) => {
      // Don't update on blur events as they're noisy
      if (type === 'blur') return;
      
      // For operations tab, log all changes
      if (name && name.startsWith('operations.')) {
        console.log(`Form field updated: ${name}`, form.getValues(name));
      }
      
      // Only send significant updates to reduce unnecessary saves
      if (type === 'change' && Object.keys(formValues).length > 0) {
        console.log('Form changed, updating form data with:', formValues);
        updateFormData(formValues);
      }
    });
    
    // Clean up subscription
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);
};
