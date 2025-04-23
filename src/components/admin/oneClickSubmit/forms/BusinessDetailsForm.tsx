
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useApplicationFlow } from '../useApplicationFlow';

// Define validation schema for business details
const schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  monthlyVolume: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof schema>;

export const BusinessDetailsForm: React.FC = () => {
  const { formData, updateFormData } = useApplicationFlow();
  
  // Initialize form with existing data or defaults
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: "",
      businessType: "",
      email: "",
      phoneNumber: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      monthlyVolume: "",
    },
    mode: "onChange",
  });

  // Load existing business data when available
  useEffect(() => {
    if (formData?.business) {
      const businessData = formData.business;
      form.reset({
        businessName: businessData.businessName || "",
        businessType: businessData.businessType || "",
        email: businessData.email || "",
        phoneNumber: businessData.phoneNumber || "",
        website: businessData.website || "",
        address: businessData.address || "",
        city: businessData.city || "",
        state: businessData.state || "",
        zipCode: businessData.zipCode || "",
        monthlyVolume: businessData.monthlyVolume || "",
      });
    }
  }, [formData, form.reset]);

  // Save form data when values change
  const handleFormChange = (values: BusinessFormValues) => {
    updateFormData({ business: values });
  };

  return (
    <Form {...form}>
      <form 
        className="space-y-6" 
        onChange={form.handleSubmit(handleFormChange)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Phone */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
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

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
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

          {/* State */}
          <FormField
            control={form.control}
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

          {/* Zip Code */}
          <FormField
            control={form.control}
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
        </div>
      </form>
    </Form>
  );
};

export default BusinessDetailsForm;
