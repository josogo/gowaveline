
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { DocumentFormValues } from './DocumentFormSchema';

interface DocumentTypeFieldProps {
  form: UseFormReturn<DocumentFormValues>;
}

export const DocumentTypeField: React.FC<DocumentTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="document_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Document Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="template">Template</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
              <SelectItem value="agreement">Agent Agreement</SelectItem>
              <SelectItem value="preapp">Pre-Application Form</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
