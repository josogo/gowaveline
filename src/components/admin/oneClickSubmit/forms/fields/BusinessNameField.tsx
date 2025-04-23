
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useBusinessName } from '../../hooks/useBusinessName';

interface BusinessNameFieldProps {
  defaultValue?: string;
}

export const BusinessNameField = ({ defaultValue }: BusinessNameFieldProps) => {
  const form = useFormContext();
  const getBusinessName = useBusinessName(defaultValue, form.getValues());

  React.useEffect(() => {
    const businessName = getBusinessName();
    if (businessName && businessName !== form.getValues('businessName')) {
      form.setValue('businessName', businessName);
    }
  }, [form, getBusinessName]);

  return (
    <FormField
      control={form.control}
      name="businessName"
      defaultValue={getBusinessName() || defaultValue || ''}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Business Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter business name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
