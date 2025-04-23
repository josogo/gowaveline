
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const AddressField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="address"
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

export default AddressField;
