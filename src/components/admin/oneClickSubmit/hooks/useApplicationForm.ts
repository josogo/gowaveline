
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useFormData } from './useFormData';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Create a base schema for the application form
const baseFormSchema = z.object({
  // Basic schema that all tabs will extend
  currentTab: z.string().optional(),
  // Add common fields here
});

export const useApplicationForm = (merchantApplication?: any) => {
  const form = useForm({
    defaultValues: merchantApplication?.application_data || {},
    // We'll use context to handle validation at the tab level
    resolver: zodResolver(baseFormSchema)
  });
  
  const { formData, updateFormData, isDirty, resetDirtyState } = useFormData(
    merchantApplication?.application_data || {}
  );

  // Initialize form data from merchant application or localStorage
  useEffect(() => {
    if (merchantApplication?.id) {
      // Check localStorage first for most recent data
      const savedStateStr = localStorage.getItem(`application_${merchantApplication.id}`);
      
      if (savedStateStr) {
        try {
          const savedState = JSON.parse(savedStateStr);
          
          if (savedState.formData) {
            // Use localStorage data as it's most recent
            const initialData = {
              businessName: merchantApplication.merchant_name,
              businessEmail: merchantApplication.merchant_email,
              applicationNumber: merchantApplication.application_number || '',
              currentTab: savedState.activeTab || 'business',
              ...savedState.formData
            };
            
            console.log("Initializing form with localStorage data:", initialData);
            updateFormData(initialData);
            form.reset(initialData);
            return;
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }
      
      // Fallback to database data if no localStorage data is available
      if (merchantApplication?.application_data) {
        const initialData = {
          businessName: merchantApplication.merchant_name,
          businessEmail: merchantApplication.merchant_email,
          applicationNumber: merchantApplication.application_number || '',
          currentTab: merchantApplication.application_data.currentTab || 'business',
          ...merchantApplication.application_data
        };
        
        console.log("Initializing form with database data:", initialData);
        updateFormData(initialData);
        form.reset(initialData);
      }
    }
  }, [merchantApplication, updateFormData, form]);

  // Update formData when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value);
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  return {
    form,
    formData,
    updateFormData,
    isDirty,
    resetDirtyState
  };
};
