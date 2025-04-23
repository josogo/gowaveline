
import React, { useEffect } from "react";
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
import { toast } from "sonner";

const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  // Add other business fields as needed
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export const BusinessDetailsForm = () => {
  const { formData, updateFormData, saveApplicationData, merchantAppId } = useApplicationFlow(null);
  
  // Initialize with existing data or defaults
  const businessData = formData?.business || {};
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: businessData.businessName || "",
      email: businessData.email || "",
      phone: businessData.phone || "",
      address: businessData.address || "",
      city: businessData.city || "",
      state: businessData.state || "",
      zipCode: businessData.zipCode || "",
      // Add other fields with their defaults
    },
  });

  // Sync form with formData when it changes externally
  useEffect(() => {
    if (formData?.business) {
      form.reset({
        businessName: formData.business.businessName || "",
        email: formData.business.email || "",
        phone: formData.business.phone || "",
        address: formData.business.address || "",
        city: formData.business.city || "",
        state: formData.business.state || "",
        zipCode: formData.business.zipCode || "",
        // Reset other fields
      });
    }
  }, [formData?.business, form]);

  // Save form data when fields change
  const handleFieldChange = async (data: BusinessFormValues) => {
    if (!merchantAppId) return;
    
    updateFormData({ business: data });
    const saved = await saveApplicationData();
    if (!saved) {
      toast.error("Failed to save business details");
    }
  };

  // Save on form submit
  const handleSubmit = async (data: BusinessFormValues) => {
    await handleFieldChange(data);
    toast.success("Business details saved");
  };

  return (
    <Form {...form}>
      <form 
        className="space-y-4"
        onChange={form.handleSubmit(handleFieldChange)}
        onBlur={form.handleSubmit(handleFieldChange)}
        onSubmit={form.handleSubmit(handleSubmit)}
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
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default BusinessDetailsForm;
