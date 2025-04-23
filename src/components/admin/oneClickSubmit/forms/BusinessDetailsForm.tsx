import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BusinessNameField } from './fields/BusinessNameField';
import { EmailField } from './fields/EmailField';
import { PhoneField } from './fields/PhoneField';
import { AddressField } from './fields/AddressField';
import { WebsiteField } from './fields/WebsiteField';
import { IndustrySelect } from './fields/IndustrySelect';
import { BusinessDescriptionField } from './fields/BusinessDescriptionField';

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
        <PhoneField />
        <AddressField />
        <WebsiteField />
        <IndustrySelect />
      </div>
      <BusinessDescriptionField />
    </div>
  );
};
