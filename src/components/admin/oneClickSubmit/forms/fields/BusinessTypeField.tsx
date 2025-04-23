
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  control: any;
};

const BusinessTypeField: React.FC<Props> = ({ control }) => (
  <FormField
    control={control}
    name="businessType"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Business Type</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default BusinessTypeField;
