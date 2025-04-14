
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BusinessDetailsForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel>Legal Business Name</FormLabel>
          <Input placeholder="Enter legal business name" />
          <p className="text-xs text-muted-foreground mt-1">
            As it appears on tax documents and bank accounts
          </p>
        </div>
        
        <div>
          <FormLabel>DBA (Doing Business As)</FormLabel>
          <Input placeholder="Enter DBA if different from legal name" />
          <p className="text-xs text-muted-foreground mt-1">
            If different from legal name
          </p>
        </div>
        
        <div>
          <FormLabel>Business Structure</FormLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select business structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="s-corp">S-Corporation</SelectItem>
              <SelectItem value="c-corp">C-Corporation</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="sole-prop">Sole Proprietorship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <FormLabel>Tax ID (EIN)</FormLabel>
          <Input placeholder="XX-XXXXXXX" />
        </div>
        
        <div>
          <FormLabel>Website URL</FormLabel>
          <Input placeholder="https://example.com" />
        </div>
        
        <div>
          <FormLabel>Years in Business</FormLabel>
          <Input type="number" placeholder="0" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel>Street Address</FormLabel>
            <Input placeholder="123 Main St" />
          </div>
          
          <div>
            <FormLabel>Suite/Unit</FormLabel>
            <Input placeholder="Suite 100" />
          </div>
          
          <div>
            <FormLabel>City</FormLabel>
            <Input placeholder="City" />
          </div>
          
          <div>
            <FormLabel>State</FormLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
                <SelectItem value="fl">Florida</SelectItem>
                {/* More states would be added here */}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <FormLabel>ZIP Code</FormLabel>
            <Input placeholder="12345" />
          </div>
          
          <div>
            <FormLabel>Country</FormLabel>
            <Select defaultValue="us">
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                {/* More countries would be added here */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <p className="text-sm text-blue-600">+ Add alternate contact</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel>Business Phone</FormLabel>
            <Input placeholder="(555) 123-4567" />
          </div>
          
          <div>
            <FormLabel>Business Email</FormLabel>
            <Input placeholder="contact@example.com" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
