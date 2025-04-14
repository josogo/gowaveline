
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export const OperationalDetailsForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel>Product/Service Category</FormLabel>
          <Select>
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
          <FormLabel>MCC Code</FormLabel>
          <Input placeholder="Enter 4-digit MCC code" />
          <p className="text-xs text-muted-foreground mt-1">
            If unsure, our AI will suggest appropriate MCC codes
          </p>
        </div>
        
        <div>
          <FormLabel>NAICS Code</FormLabel>
          <Input placeholder="Enter 6-digit NAICS code" />
          <p className="text-xs text-muted-foreground mt-1">
            Will be auto-detected based on your business description
          </p>
        </div>
        
        <div>
          <FormLabel>Business Description</FormLabel>
          <Textarea placeholder="Describe your products or services in detail" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fulfillment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel>Fulfillment Model</FormLabel>
            <Select>
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
            <FormLabel>Average Fulfillment Time</FormLabel>
            <Select>
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
            <FormLabel>Shipping Method</FormLabel>
            <Select>
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
            <FormLabel>Return Policy Timeframe</FormLabel>
            <Select>
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
            <FormLabel>Average Ticket Size ($)</FormLabel>
            <Input type="number" placeholder="0.00" />
          </div>
          
          <div>
            <FormLabel>Monthly Processing Volume ($)</FormLabel>
            <Input type="number" placeholder="0.00" />
          </div>
          
          <div>
            <FormLabel>Chargeback Percentage (%)</FormLabel>
            <Input type="number" placeholder="0.00" />
          </div>
          
          <div>
            <FormLabel>Refund Percentage (%)</FormLabel>
            <Input type="number" placeholder="0.00" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recurring Billing</h3>
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="recurring-billing" />
          <FormLabel htmlFor="recurring-billing" className="cursor-pointer">
            This business uses subscription/recurring billing
          </FormLabel>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel>Billing Frequency</FormLabel>
            <Select>
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
            <FormLabel>Recurring Billing Software</FormLabel>
            <Input placeholder="e.g. Stripe, Chargebee, ReCharge" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Switch id="free-trial" />
              <FormLabel htmlFor="free-trial" className="cursor-pointer">
                Free trial offered
              </FormLabel>
            </div>
            <p className="text-xs text-muted-foreground">
              If you offer a free trial before charging customers
            </p>
          </div>
          
          <div>
            <FormLabel>Free Trial Length (Days)</FormLabel>
            <Input type="number" placeholder="0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalDetailsForm;
