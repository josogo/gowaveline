
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface BusinessStructureTabProps {
  form: UseFormReturn<any>;
  goToNextTab: () => void;
}

export const BusinessStructureTab: React.FC<BusinessStructureTabProps> = ({ form, goToNextTab }) => {
  const showOtherField = form.watch('businessStructure') === 'other';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Business Structure</h3>
        <p className="text-sm text-gray-500 mb-4">Select your business type</p>

        <FormField
          control={form.control}
          name="businessStructure"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sole_proprietorship" id="sole_proprietorship" />
                    <Label htmlFor="sole_proprietorship">Sole Proprietorship</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corporation" id="corporation" />
                    <Label htmlFor="corporation">Corporation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="llc" id="llc" />
                    <Label htmlFor="llc">LLC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non_profit" id="non_profit" />
                    <Label htmlFor="non_profit">Non-profit (401c)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="government" id="government" />
                    <Label htmlFor="government">Government</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showOtherField && (
          <FormField
            control={form.control}
            name="businessStructureOther"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Please specify other business type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter business type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={goToNextTab}>
          Next
        </Button>
      </div>
    </div>
  );
};
