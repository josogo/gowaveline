
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface BusinessInfoTabProps {
  form: UseFormReturn<PreAppFormValues>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const BusinessInfoTab: React.FC<BusinessInfoTabProps> = ({ 
  form, 
  goToNextTab,
  goToPrevTab
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">2. Business Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street (Location) Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Street address" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mailingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mailing (Legal) Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Mailing address" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="businessPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business/Contact Telephone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Business phone" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="businessEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business/Contact Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Business email" type="email" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="businessFax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Fax #</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Business fax" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customerServicePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Service Telephone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Customer service phone" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customerServiceEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Service Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Customer service email" type="email" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website/URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Website URL (without http://)" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">3. Authorized Contact</h3>
        <FormField
          control={form.control}
          name="authorizedContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full name of authorized contact" />
              </FormControl>
            </FormItem>
          )}
        />

        <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">4. Equipment / Software</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="terminalGateway"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal/Gateway Used</FormLabel>
                <FormDescription>e.g., VX 520, Authorize.net, NMI</FormDescription>
                <FormControl>
                  <Input {...field} placeholder="Terminal or gateway used" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="shoppingCart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shopping Cart (if applicable)</FormLabel>
                <FormDescription>If using Shopify, request Authorize.net Gateway</FormDescription>
                <FormControl>
                  <Input {...field} placeholder="Shopping cart platform" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">5. Business Location</h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="employeeCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Employees</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Number of employees" type="text" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Type</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home_location" />
                          <Label htmlFor="home_location">Home/Residential</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office_location" />
                          <Label htmlFor="office_location">Office/Business District</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="storefront" id="storefront_location" />
                          <Label htmlFor="storefront_location">Storefront</Label>
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
            name="ownOrRent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Own or Rent</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="own" id="own_location" />
                          <Label htmlFor="own_location">Own</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rent" id="rent_location" />
                          <Label htmlFor="rent_location">Rent</Label>
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
            name="squareFootage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approx. Square Footage</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-500" id="footage_0_500" />
                          <Label htmlFor="footage_0_500">0–500 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="501-2000" id="footage_501_2000" />
                          <Label htmlFor="footage_501_2000">501–2,000 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2001-5000" id="footage_2001_5000" />
                          <Label htmlFor="footage_2001_5000">2,001–5,000 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5000+" id="footage_5000_plus" />
                          <Label htmlFor="footage_5000_plus">5,000+ ft²</Label>
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
        <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
          Next
        </Button>
      </div>
    </div>
  );
};
