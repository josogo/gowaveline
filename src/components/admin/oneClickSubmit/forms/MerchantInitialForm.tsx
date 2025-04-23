
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// Validation schema with ONLY the required fields for the initial screen
const schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  email: z.string().email("Enter a valid email"),
  monthlyVolume: z.string().min(1, "Monthly volume is required"),
});
type MerchantInitialFormValues = z.infer<typeof schema>;

export const MerchantInitialForm: React.FC<{ onNext: (data: MerchantInitialFormValues) => void }> = ({ onNext }) => {
  const form = useForm<MerchantInitialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: "",
      businessType: "",
      email: "",
      monthlyVolume: "",
    },
    mode: "onChange"
  });

  // Handle submission
  const handleSubmit = (values: MerchantInitialFormValues) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-6 max-w-lg mx-auto" onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Business Name */}
        <FormField
          control={form.control}
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
        {/* Business Type */}
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {/* Email */}
        <FormField
          control={form.control}
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
        {/* Monthly Volume */}
        <FormField
          control={form.control}
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
        {/* Continue/Next */}
        <Button type="submit" className="w-full mt-6" disabled={!form.formState.isValid}>
          Next
        </Button>
      </form>
    </Form>
  );
};
