
import { useState, useEffect, useId } from 'react';
import { UseFormReturn } from 'react-hook-form';

/**
 * Custom hook for handling dialog state reset
 */
export const useDialogReset = <T extends Record<string, any>>(
  open: boolean,
  form: UseFormReturn<T>,
  defaultValues: T
) => {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const formResetKey = useId() + retryAttempt;
  
  // Reset form when the dialog closes or retry attempt changes
  useEffect(() => {
    form.reset(defaultValues);
  }, [formResetKey, open, form, defaultValues]);
  
  const incrementRetry = () => setRetryAttempt(prev => prev + 1);
  
  return {
    formResetKey,
    retryAttempt,
    incrementRetry
  };
};
