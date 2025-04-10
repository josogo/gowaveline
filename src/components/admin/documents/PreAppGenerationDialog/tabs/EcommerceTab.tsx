
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface EcommerceTabProps {
  form: UseFormReturn<PreAppFormValues>;
  goToPrevTab: () => void;
}

export const EcommerceTab: React.FC<EcommerceTabProps> = ({ form, goToPrevTab }) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">13. eCommerce / Card-Not-Present</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productPurchaseAddresses"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Product Purchase Address(es)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="List addresses" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="inventoryOwnership"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Who Owns Inventory?</FormLabel>
                <div className="grid grid-cols-1 gap-2">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merchant" id="merchant_inventory" />
                          <Label htmlFor="merchant_inventory">Merchant</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vendor" id="vendor_inventory" />
                          <Label htmlFor="vendor_inventory">Vendor (Drop Ship)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fulfillmentProviders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fulfillment Provider(s)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="List providers" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="shoppingCartPlatforms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shopping Cart / CRM Platform(s)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Shopify, WooCommerce, etc." />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormLabel>How Do Customers Purchase?</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <FormField
                control={form.control}
                name="purchaseMethods"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch('purchaseMethods').includes('in_person')}
                        onCheckedChange={(checked) => {
                          const methods = [...form.watch('purchaseMethods')];
                          if (checked) {
                            if (!methods.includes('in_person')) {
                              methods.push('in_person');
                            }
                          } else {
                            const index = methods.indexOf('in_person');
                            if (index !== -1) methods.splice(index, 1);
                          }
                          form.setValue('purchaseMethods', methods);
                        }}
                        id="purchase-in-person"
                      />
                    </FormControl>
                    <FormLabel htmlFor="purchase-in-person">In Person</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseMethods"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch('purchaseMethods').includes('mail_phone')}
                        onCheckedChange={(checked) => {
                          const methods = [...form.watch('purchaseMethods')];
                          if (checked) {
                            if (!methods.includes('mail_phone')) {
                              methods.push('mail_phone');
                            }
                          } else {
                            const index = methods.indexOf('mail_phone');
                            if (index !== -1) methods.splice(index, 1);
                          }
                          form.setValue('purchaseMethods', methods);
                        }}
                        id="purchase-mail-phone"
                      />
                    </FormControl>
                    <FormLabel htmlFor="purchase-mail-phone">Mail/Phone</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseMethods"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch('purchaseMethods').includes('internet')}
                        onCheckedChange={(checked) => {
                          const methods = [...form.watch('purchaseMethods')];
                          if (checked) {
                            if (!methods.includes('internet')) {
                              methods.push('internet');
                            }
                          } else {
                            const index = methods.indexOf('internet');
                            if (index !== -1) methods.splice(index, 1);
                          }
                          form.setValue('purchaseMethods', methods);
                        }}
                        id="purchase-internet"
                      />
                    </FormControl>
                    <FormLabel htmlFor="purchase-internet">Internet</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseMethods"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch('purchaseMethods').includes('fax')}
                        onCheckedChange={(checked) => {
                          const methods = [...form.watch('purchaseMethods')];
                          if (checked) {
                            if (!methods.includes('fax')) {
                              methods.push('fax');
                            }
                          } else {
                            const index = methods.indexOf('fax');
                            if (index !== -1) methods.splice(index, 1);
                          }
                          form.setValue('purchaseMethods', methods);
                        }}
                        id="purchase-fax"
                      />
                    </FormControl>
                    <FormLabel htmlFor="purchase-fax">Fax</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchaseMethods"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch('purchaseMethods').includes('other')}
                        onCheckedChange={(checked) => {
                          const methods = [...form.watch('purchaseMethods')];
                          if (checked) {
                            if (!methods.includes('other')) {
                              methods.push('other');
                            }
                          } else {
                            const index = methods.indexOf('other');
                            if (index !== -1) methods.splice(index, 1);
                          }
                          form.setValue('purchaseMethods', methods);
                        }}
                        id="purchase-other"
                      />
                    </FormControl>
                    <FormLabel htmlFor="purchase-other">Other</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch('purchaseMethods').includes('other') && (
              <FormField
                control={form.control}
                name="purchaseMethodsOther"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Other Purchase Method</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Please specify" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="authToShipTimeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authorization to Ship Timeframe</FormLabel>
                <div className="grid grid-cols-1">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-7" id="ship_0_7" />
                          <Label htmlFor="ship_0_7">0–7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="8-14" id="ship_8_14" />
                          <Label htmlFor="ship_8_14">8–14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15-30" id="ship_15_30" />
                          <Label htmlFor="ship_15_30">15–30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-90" id="ship_30_90" />
                          <Label htmlFor="ship_30_90">30–90 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90+" id="ship_90_plus" />
                          <Label htmlFor="ship_90_plus">90+ days</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryTimeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Timeframe</FormLabel>
                <div className="grid grid-cols-1">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-7" id="delivery_0_7" />
                          <Label htmlFor="delivery_0_7">0–7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="8-14" id="delivery_8_14" />
                          <Label htmlFor="delivery_8_14">8–14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15-30" id="delivery_15_30" />
                          <Label htmlFor="delivery_15_30">15–30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-90" id="delivery_30_90" />
                          <Label htmlFor="delivery_30_90">30–90 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90+" id="delivery_90_plus" />
                          <Label htmlFor="delivery_90_plus">90+ days</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="warrantyProvider"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Warranty Provider</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-row space-x-8"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merchant" id="merchant_warranty" />
                          <Label htmlFor="merchant_warranty">Merchant</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manufacturer" id="manufacturer_warranty" />
                          <Label htmlFor="manufacturer_warranty">Manufacturer</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={goToPrevTab} variant="outline">
          Previous
        </Button>
      </div>
    </div>
  );
};
