
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const CityField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="city"
    render={({ field }) => (
      <FormItem>
        <FormLabel>City</FormLabel>
        <FormControl>
          <Input placeholder="New York" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default CityField;
