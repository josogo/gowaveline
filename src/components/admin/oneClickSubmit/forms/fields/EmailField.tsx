
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface EmailFieldProps {
  defaultValue?: string;
}

export const EmailField = ({ defaultValue }: EmailFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="businessEmail"
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Business Email</FormLabel>
          <FormControl>
            <Input {...field} type="email" placeholder="Enter business email" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
