
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface PhoneFieldProps {
  defaultValue?: string;
}

export const PhoneField = ({ defaultValue }: PhoneFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="businessPhone"
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Business Phone</FormLabel>
          <FormControl>
            <Input {...field} type="tel" placeholder="(555) 123-4567" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneField;
