
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export const OperationalDetailsForm: React.FC = () => {
  const { register, setValue, watch } = useFormContext();
  
  // Initialize switches with watched values
  const usesRecurringBilling = watch('operations.usesRecurringBilling') || false;
  const offersFreeTrials = watch('operations.offersFreeTrials') || false;
  
  // Handle select changes (since register doesn't work directly with Select component)
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Product/Service Category</Label>
          <Select 
            defaultValue={watch('operations.productCategory')}
            onValueChange={(value) => handleSelectChange('productCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cbd">CBD & Hemp Products</SelectItem>
              <SelectItem value="nutra">Nutraceuticals</SelectItem>
              <SelectItem value="subscription">Subscription Box</SelectItem>
              <SelectItem value="vape">Vape Products</SelectItem>
              <SelectItem value="adult">Adult Products</SelectItem>
              <SelectItem value="gaming">Gaming & Gambling</SelectItem>
              <SelectItem value="debt">Debt Collection</SelectItem>
              <SelectItem value="financial">Financial Services</SelectItem>
              <SelectItem value="other">Other High-Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="operations.mccCode">MCC Code</Label>
          <Input 
            id="operations.mccCode"
            placeholder="Enter 4-digit MCC code" 
            {...register('operations.mccCode')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            If unsure, our AI will suggest appropriate MCC codes
          </p>
        </div>
        
        <div>
          <Label htmlFor="operations.naicsCode">NAICS Code</Label>
          <Input 
            id="operations.naicsCode"
            placeholder="Enter 6-digit NAICS code" 
            {...register('operations.naicsCode')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Will be auto-detected based on your business description
          </p>
        </div>
        
        <div>
          <Label htmlFor="operations.businessDescription">Business Description</Label>
          <Textarea 
            id="operations.businessDescription"
            placeholder="Describe your products or services in detail" 
            {...register('operations.businessDescription')}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fulfillment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Fulfillment Model</Label>
            <Select 
              defaultValue={watch('operations.fulfillmentModel')}
              onValueChange={(value) => handleSelectChange('fulfillmentModel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fulfillment model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">Physical Product Shipping</SelectItem>
                <SelectItem value="digital">Digital Product Delivery</SelectItem>
                <SelectItem value="dropship">Dropshipping</SelectItem>
                <SelectItem value="on-demand">On-demand Manufacturing</SelectItem>
                <SelectItem value="service">Service-based</SelectItem>
                <SelectItem value="hybrid">Hybrid (Physical + Digital)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Average Fulfillment Time</Label>
            <Select 
              defaultValue={watch('operations.fulfillmentTime')}
              onValueChange={(value) => handleSelectChange('fulfillmentTime', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (Digital)</SelectItem>
                <SelectItem value="same-day">Same Day</SelectItem>
                <SelectItem value="1-2-days">1-2 Business Days</SelectItem>
                <SelectItem value="3-5-days">3-5 Business Days</SelectItem>
                <SelectItem value="1-2-weeks">1-2 Weeks</SelectItem>
                <SelectItem value="over-2-weeks">Over 2 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Shipping Method</Label>
            <Select 
              defaultValue={watch('operations.shippingMethod')}
              onValueChange={(value) => handleSelectChange('shippingMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usps">USPS</SelectItem>
                <SelectItem value="ups">UPS</SelectItem>
                <SelectItem value="fedex">FedEx</SelectItem>
                <SelectItem value="dhl">DHL</SelectItem>
                <SelectItem value="multiple">Multiple Carriers</SelectItem>
                <SelectItem value="digital">Digital Delivery (No Shipping)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Return Policy Timeframe</Label>
            <Select 
              defaultValue={watch('operations.returnPolicy')}
              onValueChange={(value) => handleSelectChange('returnPolicy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Returns</SelectItem>
                <SelectItem value="7-days">7 Days</SelectItem>
                <SelectItem value="14-days">14 Days</SelectItem>
                <SelectItem value="30-days">30 Days</SelectItem>
                <SelectItem value="60-days">60 Days</SelectItem>
                <SelectItem value="90-days">90 Days</SelectItem>
                <SelectItem value="custom">Custom Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Processing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="operations.avgTicket">Average Ticket Size ($)</Label>
            <Input 
              id="operations.avgTicket"
              type="number" 
              placeholder="0.00" 
              {...register('operations.avgTicket')}
            />
          </div>
          
          <div>
            <Label htmlFor="operations.monthlyVolume">Monthly Processing Volume ($)</Label>
            <Input 
              id="operations.monthlyVolume"
              type="number" 
              placeholder="0.00" 
              {...register('operations.monthlyVolume')}
            />
          </div>
          
          <div>
            <Label htmlFor="operations.chargebackPercent">Chargeback Percentage (%)</Label>
            <Input 
              id="operations.chargebackPercent"
              type="number" 
              placeholder="0.00" 
              {...register('operations.chargebackPercent')}
            />
          </div>
          
          <div>
            <Label htmlFor="operations.refundPercent">Refund Percentage (%)</Label>
            <Input 
              id="operations.refundPercent"
              type="number" 
              placeholder="0.00" 
              {...register('operations.refundPercent')}
            />
          </div>
        </div>
      </div>
      
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
    </div>
  );
};

export default OperationalDetailsForm;
