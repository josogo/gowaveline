
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const BusinessNameField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="businessName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Business Name</FormLabel>
        <FormControl>
          <Input placeholder="ACME Corp" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default BusinessNameField;
