
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface BusinessNameFieldProps {
  defaultValue?: string;
}

export const BusinessNameField = ({ defaultValue }: BusinessNameFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="businessName"
      defaultValue={defaultValue}
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
