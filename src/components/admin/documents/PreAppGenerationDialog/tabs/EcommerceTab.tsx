
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EcommerceTabProps {
  form: UseFormReturn<any>;
  goToPrevTab: () => void;
}

export const EcommerceTab: React.FC<EcommerceTabProps> = ({ form, goToPrevTab }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">eCommerce Information</h3>
        <p className="text-sm text-gray-500 mb-4">Enter details about your online business operations</p>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="purchaseMethods"
            render={() => (
              <FormItem>
                <FormLabel>Transaction Methods</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="purchaseMethods"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes('inperson')}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, 'inperson'])
                                : field.onChange(currentValues.filter(value => value !== 'inperson'));
                            }}
                          />
                        </FormControl>
                        <FormLabel>Face-to-Face (Retail)</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purchaseMethods"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes('mailphone')}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, 'mailphone'])
                                : field.onChange(currentValues.filter(value => value !== 'mailphone'));
                            }}
                          />
                        </FormControl>
                        <FormLabel>Mail/Phone/Email (MOTO)</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purchaseMethods"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes('internet')}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, 'internet'])
                                : field.onChange(currentValues.filter(value => value !== 'internet'));
                            }}
                          />
                        </FormControl>
                        <FormLabel>Internet (eCommerce)</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="faceToFacePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Face-to-Face %</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="motoPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MOTO %</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ecommercePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>eCommerce %</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="40" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shoppingCartPlatforms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shopping Cart Platform</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Shopify, WooCommerce, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authToShipTimeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auth to Ship Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-7">0-7 Days</SelectItem>
                      <SelectItem value="8-14">8-14 Days</SelectItem>
                      <SelectItem value="15-30">15-30 Days</SelectItem>
                      <SelectItem value="30-90">30-90 Days</SelectItem>
                      <SelectItem value="90+">90+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryTimeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-7">0-7 Days</SelectItem>
                      <SelectItem value="8-14">8-14 Days</SelectItem>
                      <SelectItem value="15-30">15-30 Days</SelectItem>
                      <SelectItem value="30-90">30-90 Days</SelectItem>
                      <SelectItem value="90+">90+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
          
          <FormField
            control={form.control}
            name="internationalTransactionsPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>International Transactions Percentage (%)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10" />
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
        <Button type="submit" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
          Generate Application
        </Button>
      </div>
    </div>
  );
};
