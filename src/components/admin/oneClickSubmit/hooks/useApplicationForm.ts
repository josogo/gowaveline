
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useFormData } from './useFormData';

export const useApplicationForm = (merchantApplication?: any) => {
  const form = useForm({
    defaultValues: merchantApplication?.application_data || {}
  });
  
  const { formData, updateFormData, isDirty, resetDirtyState } = useFormData(
    merchantApplication?.application_data || {}
  );

  // Initialize form data from merchant application
  useEffect(() => {
    if (merchantApplication?.application_data) {
      const initialData = {
        businessName: merchantApplication.merchant_name,
        businessEmail: merchantApplication.merchant_email,
        currentTab: merchantApplication.application_data.currentTab || 'business',
        ...merchantApplication.application_data
      };
      
      console.log("Initializing form with data:", initialData);
      updateFormData(initialData);
      form.reset(initialData);
    }
  }, [merchantApplication, updateFormData, form]);

  return {
    form,
    formData,
    updateFormData,
    isDirty,
    resetDirtyState
  };
};
