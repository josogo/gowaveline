
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface BankingInfoTabProps {
  form: UseFormReturn<PreAppFormValues>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const BankingInfoTab: React.FC<BankingInfoTabProps> = ({ 
  form, 
  goToNextTab,
  goToPrevTab 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">7. Bank Settlement Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Bank name" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bankContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name at Bank</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Contact name at bank" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="routingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Routing Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Routing number" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Account number" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">8. Business Description</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productsServices"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Products/Services Sold</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe products or services" rows={3} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="yearsInOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years in Operation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Years in operation" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="storageLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Location (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Storage location" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={goToPrevTab} variant="outline">
          Previous
        </Button>
        <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
          Next
        </Button>
      </div>
    </div>
  );
};
