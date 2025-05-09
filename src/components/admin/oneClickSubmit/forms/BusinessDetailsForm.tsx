
import React from 'react';
import { useFormContext, FormProvider, useForm } from 'react-hook-form';
import { BusinessNameField } from './fields/BusinessNameField';
import { EmailField } from './fields/EmailField';
import { PhoneField } from '@/components/admin/oneClickSubmit/forms/fields/PhoneField';
import AddressField from './fields/AddressField';
import WebsiteField from './fields/WebsiteField';

// Since there's no IndustrySelect or BusinessDescriptionField yet, let's create simplified versions
// and import them correctly
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Simple IndustrySelect component
const IndustrySelect = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="industry"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Industry</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="ecommerce">E-Commerce</SelectItem>
              <SelectItem value="food">Restaurants & Food Service</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="service">Professional Services</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Simple BusinessDescriptionField component
const BusinessDescriptionField = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="businessDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Business Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Describe your business and its main products/services..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const BusinessDetailsForm = () => {
  // Check if we're in a form context
  const formContext = useFormContext();
  
  // If there's no form context, create a local form instance
  const localForm = useForm();
  
  // Use either the context form or local form
  const form = formContext || localForm;
  
  // Safe way to get values if they exist
  const getValueSafely = (fieldName: string) => {
    try {
      return form.getValues(fieldName) || '';
    } catch (e) {
      return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessNameField
          defaultValue={getValueSafely('businessName')}
        />
        
        <EmailField
          defaultValue={getValueSafely('businessEmail')}
        />
        
        <PhoneField />
        <AddressField />
        <WebsiteField />
        <IndustrySelect />
      </div>
      <BusinessDescriptionField />
    </div>
  );
};
