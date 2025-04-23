
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BusinessNameField } from './fields/BusinessNameField';
import { EmailField } from './fields/EmailField';
import { PhoneField } from './fields/PhoneField';
import AddressField from './fields/AddressField';
import WebsiteField from './fields/WebsiteField';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Create IndustrySelect component inline since it's missing
const IndustrySelect = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="industry"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Industry</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="professional-services">Professional Services</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="e-commerce">E-Commerce</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Create BusinessDescriptionField component inline since it's missing
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
              placeholder="Briefly describe your business..." 
              className="min-h-[100px]" 
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
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessNameField 
          defaultValue={form.getValues('businessName')} 
        />
        <EmailField 
          defaultValue={form.getValues('businessEmail')}
        />
        <PhoneField 
          defaultValue={form.getValues('businessPhone')}
        />
        <AddressField 
          control={form.control}
        />
        <WebsiteField 
          control={form.control}
        />
        <IndustrySelect />
      </div>
      <BusinessDescriptionField />
    </div>
  );
};
