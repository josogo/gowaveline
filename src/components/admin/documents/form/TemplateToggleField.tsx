
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { DocumentFormValues } from './DocumentFormSchema';

interface TemplateToggleFieldProps {
  form: UseFormReturn<DocumentFormValues>;
}

export const TemplateToggleField: React.FC<TemplateToggleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="is_template"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Template Document</FormLabel>
            <FormDescription>
              Mark this document as a reusable template
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
