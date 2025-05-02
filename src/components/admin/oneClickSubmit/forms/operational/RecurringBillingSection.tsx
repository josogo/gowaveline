
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export const RecurringBillingSection: React.FC = () => {
  const { register, setValue, watch } = useFormContext();
  
  // Initialize switches with watched values
  const usesRecurringBilling = watch('operations.usesRecurringBilling') || false;
  const offersFreeTrials = watch('operations.offersFreeTrials') || false;
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    console.log(`Setting operations.${field} to:`, value);
    setValue(`operations.${field}`, value, { shouldDirty: true });
  };
  
  // Handle switch changes
  const handleSwitchChange = (field: string, checked: boolean) => {
    console.log(`Setting operations.${field} to:`, checked);
    setValue(`operations.${field}`, checked, { shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recurring Billing</h3>
      <div className="flex items-center space-x-2 mb-4">
        <Switch 
          id="recurring-billing" 
          checked={usesRecurringBilling}
          onCheckedChange={(checked) => handleSwitchChange('usesRecurringBilling', checked)}
        />
        <Label htmlFor="recurring-billing" className="cursor-pointer">
          This business uses subscription/recurring billing
        </Label>
      </div>
      
      {usesRecurringBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Billing Frequency</Label>
            <Select 
              defaultValue={watch('operations.billingFrequency')}
              onValueChange={(value) => handleSelectChange('billingFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="semiannual">Semi-annually</SelectItem>
                <SelectItem value="annual">Annually</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="operations.billingSoftware">Recurring Billing Software</Label>
            <Input 
              id="operations.billingSoftware"
              placeholder="e.g. Stripe, Chargebee, ReCharge" 
              {...register('operations.billingSoftware')}
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Switch 
                id="free-trial"
                checked={offersFreeTrials}
                onCheckedChange={(checked) => handleSwitchChange('offersFreeTrials', checked)}
              />
              <Label htmlFor="free-trial" className="cursor-pointer">
                Free trial offered
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              If you offer a free trial before charging customers
            </p>
          </div>
          
          {offersFreeTrials && (
            <div>
              <Label htmlFor="operations.trialLength">Free Trial Length (Days)</Label>
              <Input 
                id="operations.trialLength"
                type="number" 
                placeholder="0" 
                {...register('operations.trialLength')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
