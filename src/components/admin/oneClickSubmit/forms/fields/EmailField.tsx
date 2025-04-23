
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const EmailField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Business Email</FormLabel>
        <FormControl>
          <Input placeholder="you@email.com" type="email" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default EmailField;
