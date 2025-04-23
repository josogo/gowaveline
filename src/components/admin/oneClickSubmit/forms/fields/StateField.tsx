
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const StateField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="state"
    render={({ field }) => (
      <FormItem>
        <FormLabel>State</FormLabel>
        <FormControl>
          <Input placeholder="NY" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default StateField;
