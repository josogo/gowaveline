
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProcessingVolumeTabProps {
  form: UseFormReturn<any>;
  goToNextTab: () => void;
  goToPrevTab: () => void;
}

export const ProcessingVolumeTab: React.FC<ProcessingVolumeTabProps> = ({ 
  form, 
  goToNextTab,
  goToPrevTab
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Processing Volume</h3>
        <p className="text-sm text-gray-500 mb-4">Enter your transaction processing details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalMonthlyVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Monthly Volume ($)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="visaMastercardVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visa/Mastercard Volume ($)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="8000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amexVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>American Express Volume ($)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="2000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="averageTicket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Transaction Amount ($)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="highestTicket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highest Transaction Amount ($)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="yearsInOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years in Operation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="5" />
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
