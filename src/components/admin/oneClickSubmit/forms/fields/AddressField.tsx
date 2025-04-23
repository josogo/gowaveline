
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface AddressFieldProps {
  defaultValue?: string;
}

const AddressField = ({ defaultValue }: AddressFieldProps = {}) => {
  const form = useFormContext();

  useEffect(() => {
    if (defaultValue && defaultValue !== form.getValues('address')) {
      form.setValue('address', defaultValue);
    }
  }, [form, defaultValue]);

  return (
    <FormField
      control={form.control}
      name="address"
      defaultValue={defaultValue || ''}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input placeholder="123 Main St" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressField;
