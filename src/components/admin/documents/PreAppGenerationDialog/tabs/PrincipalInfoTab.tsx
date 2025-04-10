
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface PrincipalInfoTabProps {
  form: UseFormReturn<PreAppFormValues>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const PrincipalInfoTab: React.FC<PrincipalInfoTabProps> = ({ 
  form, 
  goToNextTab,
  goToPrevTab 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">6. Principal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="principalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Principal's full name" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <FormField
              control={form.control}
              name="ownershipPercentage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ownership %</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ownership percentage" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalOwners"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-2 md:mt-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="additional-owners"
                    />
                  </FormControl>
                  <FormLabel htmlFor="additional-owners" className="text-sm font-normal">
                    Additional owners with 25%+ equity
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="principalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Owner, CEO, etc.)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Principal's title" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="principalPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Telephone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Home phone number" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4 mb-4">
          <FormLabel>Date of Birth</FormLabel>
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="dateOfBirthMonth"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="MM" maxLength={2} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirthDay"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="DD" maxLength={2} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirthYear"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="YYYY" maxLength={4} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ssn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSN</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Social Security Number" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="driversLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver's License #</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Driver's license number" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>License Expiration Date</FormLabel>
            <div className="grid grid-cols-3 gap-1">
              <FormField
                control={form.control}
                name="licenseExpMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="MM" maxLength={2} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseExpDay"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="DD" maxLength={2} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseExpYear"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="YYYY" maxLength={4} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="licenseState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="State" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="principalAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Home address" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="principalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Personal email" type="email" />
                </FormControl>
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
