
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  control: any;
};

const WebsiteField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="website"
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

export default WebsiteField;
