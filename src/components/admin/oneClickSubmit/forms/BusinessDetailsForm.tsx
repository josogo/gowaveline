import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useApplicationFlow } from "../useApplicationFlow";

const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email address"),
  // Add other business fields as needed
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export const BusinessDetailsForm = () => {
  const { formData, updateFormData } = useApplicationFlow(null);
  
  // Initialize with existing data or defaults
  const businessData = formData.business || {};
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: businessData.businessName || "",
      email: businessData.email || "",
      // Add other fields with their defaults
    },
  });

  // Save form data when fields change
  const handleFieldChange = (data: BusinessFormValues) => {
    updateFormData(data);
  };

  return (
    <Form {...form}>
      <form 
        className="space-y-4"
        onChange={form.handleSubmit(handleFieldChange)}
      >
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add other business form fields as needed */}
      </form>
    </Form>
  );
};

export default BusinessDetailsForm;
