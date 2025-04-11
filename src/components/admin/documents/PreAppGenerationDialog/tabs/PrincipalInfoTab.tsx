
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface PrincipalInfoTabProps {
  form: UseFormReturn<any>;
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
      <div>
        <h3 className="text-lg font-medium mb-2">Principal Information</h3>
        <p className="text-sm text-gray-500 mb-4">Enter details about the principal owner</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="principalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jane Smith" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="ownershipPercentage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ownership %</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalOwners"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Additional owners have 25%+</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="principalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CEO, President, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="principalPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(555) 123-4567" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="principalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="jane@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="dateOfBirthMonth"
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="MM" maxLength={2} />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirthDay"
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="DD" maxLength={2} />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirthYear"
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="YYYY" maxLength={4} />
                  </FormControl>
                )}
              />
            </div>
          </FormItem>

          <FormField
            control={form.control}
            name="principalAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123 Home St, City, State ZIP" />
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
        <Button type="button" onClick={goToNextTab}>
          Next
        </Button>
      </div>
    </div>
  );
};
