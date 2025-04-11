
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface InternationalSectionProps {
  form: UseFormReturn<any>;
}

export const InternationalSection: React.FC<InternationalSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="internationalTransactionsPercentage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>International Transactions Percentage (%)</FormLabel>
          <FormControl>
            <Input {...field} placeholder="10" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
