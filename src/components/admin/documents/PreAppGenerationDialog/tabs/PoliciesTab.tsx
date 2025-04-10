
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface PoliciesTabProps {
  form: UseFormReturn<PreAppFormValues>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const PoliciesTab: React.FC<PoliciesTabProps> = ({ 
  form, 
  goToNextTab,
  goToPrevTab 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">11. Refund / Cancellation Policy</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="hasRefundPolicy"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    id="has-refund-policy"
                  />
                </FormControl>
                <FormLabel htmlFor="has-refund-policy">Do you have a refund policy?</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch('hasRefundPolicy') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="policyType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Policy Type</FormLabel>
                    <div className="grid grid-cols-1 gap-2">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            value={field.value || ''}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="exchange" id="exchange_policy" />
                              <Label htmlFor="exchange_policy">Exchange</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="store_credit" id="store_credit_policy" />
                              <Label htmlFor="store_credit_policy">Store Credit</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="refund_30_days" id="refund_30_days_policy" />
                              <Label htmlFor="refund_30_days_policy">Refund within 30 days</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other_policy" />
                              <Label htmlFor="other_policy">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch('policyType') === 'other' && (
                <FormField
                  control={form.control}
                  name="policyTypeOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Policy Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Please specify" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
          
          <FormField
            control={form.control}
            name="hasProcessingHistory"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    id="has-processing-history"
                  />
                </FormControl>
                <FormLabel htmlFor="has-processing-history">Processing History?</FormLabel>
              </FormItem>
            )}
          />
          
          {form.watch('hasProcessingHistory') && (
            <FormField
              control={form.control}
              name="currentPreviousProcessors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current/Previous Processor(s)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="List processors" />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="hasPreviousTerminations"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        id="has-previous-terminations"
                      />
                    </FormControl>
                    <FormLabel htmlFor="has-previous-terminations">Previous Terminations?</FormLabel>
                  </FormItem>
                )}
              />
              
              {form.watch('hasPreviousTerminations') && (
                <FormField
                  control={form.control}
                  name="terminationsExplanation"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Please explain" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="hasBankruptcies"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        id="has-bankruptcies"
                      />
                    </FormControl>
                    <FormLabel htmlFor="has-bankruptcies">Bankruptcies?</FormLabel>
                  </FormItem>
                )}
              />
              
              {form.watch('hasBankruptcies') && (
                <FormField
                  control={form.control}
                  name="bankruptciesExplanation"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Please explain" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">12. Business Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="b2bPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>B2B (%)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="0" className="pr-8" />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="b2cPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>B2C (%)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="0" className="pr-8" />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isSeasonalBusiness"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    id="is-seasonal-business"
                  />
                </FormControl>
                <FormLabel htmlFor="is-seasonal-business">Seasonal Business?</FormLabel>
              </FormItem>
            )}
          />
          
          <div>
            <FormField
              control={form.control}
              name="hasRecurringPayments"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="has-recurring-payments"
                    />
                  </FormControl>
                  <FormLabel htmlFor="has-recurring-payments">Recurring Payments/Subscriptions?</FormLabel>
                </FormItem>
              )}
            />
            
            {form.watch('hasRecurringPayments') && (
              <FormField
                control={form.control}
                name="recurringPaymentsDetails"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Specify Details</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Please specify details" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
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
