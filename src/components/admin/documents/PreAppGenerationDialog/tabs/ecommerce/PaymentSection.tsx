
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';

interface PaymentSectionProps {
  form: UseFormReturn<any>;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ form }) => {
  return (
    <>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="depositsRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Deposits Required</FormLabel>
            </FormItem>
          )}
        />
        
        {form.watch('depositsRequired') && (
          <FormField
            control={form.control}
            name="depositPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Percentage (%)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <FormField
        control={form.control}
        name="fullPaymentTiming"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Payment Timing</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advance" id="advance" />
                  <FormLabel htmlFor="advance">In Advance</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <FormLabel htmlFor="delivery">Upon Delivery</FormLabel>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
