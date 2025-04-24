
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export const OperationalDetailsForm: React.FC = () => {
  // Get form context to properly register fields
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="productCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mccCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MCC Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter 4-digit MCC code" />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                If unsure, our AI will suggest appropriate MCC codes
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="naicsCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NAICS Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter 6-digit NAICS code" />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Will be auto-detected based on your business description
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessOperationsDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe your products or services in detail" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fulfillment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fulfillmentModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fulfillment Model</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fulfillment model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="physical">Physical Product Shipping</SelectItem>
                    <SelectItem value="digital">Digital Product Delivery</SelectItem>
                    <SelectItem value="dropship">Dropshipping</SelectItem>
                    <SelectItem value="on-demand">On-demand Manufacturing</SelectItem>
                    <SelectItem value="service">Service-based</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Physical + Digital)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fulfillmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Fulfillment Time</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (Digital)</SelectItem>
                    <SelectItem value="same-day">Same Day</SelectItem>
                    <SelectItem value="1-2-days">1-2 Business Days</SelectItem>
                    <SelectItem value="3-5-days">3-5 Business Days</SelectItem>
                    <SelectItem value="1-2-weeks">1-2 Weeks</SelectItem>
                    <SelectItem value="over-2-weeks">Over 2 Weeks</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="shippingMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Method</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="usps">USPS</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="multiple">Multiple Carriers</SelectItem>
                    <SelectItem value="digital">Digital Delivery (No Shipping)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="returnPolicyTimeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Policy Timeframe</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Processing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="averageTicketSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Ticket Size ($)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="monthlyProcessingVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Processing Volume ($)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="chargebackPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chargeback Percentage (%)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="refundPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refund Percentage (%)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recurring Billing</h3>
        <FormField
          control={form.control}
          name="hasRecurringBilling"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 mb-4">
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                  id="recurring-billing"
                />
              </FormControl>
              <FormLabel htmlFor="recurring-billing" className="cursor-pointer">
                This business uses subscription/recurring billing
              </FormLabel>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="billingFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Frequency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recurringBillingSoftware"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurring Billing Software</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Stripe, Chargebee, ReCharge" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hasFreeTrial"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center space-x-2 mb-2">
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      id="free-trial"
                    />
                  </FormControl>
                  <FormLabel htmlFor="free-trial" className="cursor-pointer">
                    Free trial offered
                  </FormLabel>
                </div>
                <p className="text-xs text-muted-foreground">
                  If you offer a free trial before charging customers
                </p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="freeTrialLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Trial Length (Days)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default OperationalDetailsForm;
