
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PoliciesTabProps {
  form: UseFormReturn<any>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const PoliciesTab: React.FC<PoliciesTabProps> = ({ 
  form, 
  goToNextTab,
  goToPrevTab
}) => {
  const showRefundPolicyDetails = form.watch('hasRefundPolicy') === true;
  const showRecurringDetails = form.watch('hasRecurringPayments') === true;
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Business Policies</h3>
        <p className="text-sm text-gray-500 mb-4">Enter information about your business policies</p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="hasRefundPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Business has a refund policy</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {showRefundPolicyDetails && (
              <FormField
                control={form.control}
                name="policyType"
                render={({ field }) => (
                  <FormItem className="ml-7">
                    <FormLabel>Refund Policy Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="exchange" id="exchange" />
                          <Label htmlFor="exchange">Exchange Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="store_credit" id="store_credit" />
                          <Label htmlFor="store_credit">Store Credit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="refund_30_days" id="refund_30_days" />
                          <Label htmlFor="refund_30_days">30 Day Refund</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="policy_other" />
                          <Label htmlFor="policy_other">Other</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isSeasonalBusiness"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Seasonal business</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasRecurringPayments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Business has recurring payments</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {showRecurringDetails && (
              <FormField
                control={form.control}
                name="recurringPaymentsDetails"
                render={({ field }) => (
                  <FormItem className="ml-7">
                    <FormLabel>Recurring Payment Details</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Subscription details, frequency, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="b2bPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>B2B Sales Percentage (%)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="60" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="b2cPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>B2C Sales Percentage (%)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="40" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
