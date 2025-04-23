
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface WebsiteFieldProps {
  defaultValue?: string;
}

const WebsiteField = ({ defaultValue }: WebsiteFieldProps = {}) => {
  const form = useFormContext();

  useEffect(() => {
    if (defaultValue && defaultValue !== form.getValues('website')) {
      form.setValue('website', defaultValue);
    }
  }, [form, defaultValue]);

  return (
    <FormField
      control={form.control}
      name="website"
      defaultValue={defaultValue || ''}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Website</FormLabel>
          <FormControl>
            <Input placeholder="https://www.example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WebsiteField;
