
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface BusinessStructureTabProps {
  form: UseFormReturn<PreAppFormValues>;
  goToNextTab: () => void;
}

export const BusinessStructureTab: React.FC<BusinessStructureTabProps> = ({ form, goToNextTab }) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">1. Business Structure</h3>
        
        <FormField
          control={form.control}
          name="businessStructure"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Business Structure</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value}
                      className="flex flex-col space-y-2"
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
                        <Label htmlFor="non_profit">Non-profit (401(c))</Label>
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
                  </div>
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {form.watch('businessStructure') === 'other' && (
          <FormField
            control={form.control}
            name="businessStructureOther"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Please specify</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Specify other business structure" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
          Next
        </Button>
      </div>
    </div>
  );
};
