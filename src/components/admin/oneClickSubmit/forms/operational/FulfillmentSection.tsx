
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FulfillmentSection: React.FC = () => {
  const { setValue, watch } = useFormContext();
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    console.log(`Setting operations.${field} to:`, value);
    setValue(`operations.${field}`, value, { shouldDirty: true });
  };

  return (
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
  );
};
