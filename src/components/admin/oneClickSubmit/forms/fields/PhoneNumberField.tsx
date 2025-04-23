
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const PhoneNumberField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="phoneNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Business Phone</FormLabel>
        <FormControl>
          <Input placeholder="(123) 456-7890" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default PhoneNumberField;
