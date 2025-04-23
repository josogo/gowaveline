
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const ZipCodeField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="zipCode"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Zip Code</FormLabel>
        <FormControl>
          <Input placeholder="10001" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default ZipCodeField;
