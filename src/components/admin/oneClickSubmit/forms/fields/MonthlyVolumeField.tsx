
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const MonthlyVolumeField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="monthlyVolume"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Monthly Card Volume (USD)</FormLabel>
        <FormControl>
          <Input
            placeholder="50000"
            type="number"
            inputMode="numeric"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default MonthlyVolumeField;
