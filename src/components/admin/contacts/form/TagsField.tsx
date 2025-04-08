
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from '../MultiSelect';
import { ContactFormValues } from './types';

interface TagsFieldProps {
  form: UseFormReturn<ContactFormValues>;
  availableTags: string[];
}

export const TagsField: React.FC<TagsFieldProps> = ({ form, availableTags }) => {
  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <MultiSelect
              selected={field.value}
              options={availableTags}
              onChange={field.onChange}
              placeholder="Select or create tags"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
