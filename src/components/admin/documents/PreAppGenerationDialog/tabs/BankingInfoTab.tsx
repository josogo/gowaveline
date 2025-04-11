
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BankingInfoTabProps {
  form: UseFormReturn<any>;
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
      <div>
        <h3 className="text-lg font-medium mb-2">Banking Information</h3>
        <p className="text-sm text-gray-500 mb-4">Enter your business banking details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="First National Bank" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bankContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Contact Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} placeholder="123456789" />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} placeholder="123456789012" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPrevTab}>
          Previous
        </Button>
        <Button type="button" onClick={goToNextTab}>
          Next
        </Button>
      </div>
    </div>
  );
};
