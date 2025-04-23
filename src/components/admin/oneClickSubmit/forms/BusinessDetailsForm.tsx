
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useApplicationFlow } from '../useApplicationFlow';

import BusinessNameField from './fields/BusinessNameField';
import BusinessTypeField from './fields/BusinessTypeField';
import EmailField from './fields/EmailField';
import PhoneNumberField from './fields/PhoneNumberField';
import WebsiteField from './fields/WebsiteField';
import MonthlyVolumeField from './fields/MonthlyVolumeField';
import AddressField from './fields/AddressField';
import CityField from './fields/CityField';
import StateField from './fields/StateField';
import ZipCodeField from './fields/ZipCodeField';

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
  }, [formData, form]);

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
          <BusinessNameField control={form.control} />
          <BusinessTypeField control={form.control} />
          <EmailField control={form.control} />
          <PhoneNumberField control={form.control} />
          <WebsiteField control={form.control} />
          <MonthlyVolumeField control={form.control} />
          <AddressField control={form.control} />
          <CityField control={form.control} />
          <StateField control={form.control} />
          <ZipCodeField control={form.control} />
        </div>
      </form>
    </Form>
  );
};

export default BusinessDetailsForm;
