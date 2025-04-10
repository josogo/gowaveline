
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { PreAppFormValues } from '../../PreAppFormSchema';

interface ProcessingVolumeTabProps {
  form: UseFormReturn<PreAppFormValues>;
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
      <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">9. Processing Volume</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalMonthlyVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Total Monthly Volume (All payment types)</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <FormControl>
                    <Input {...field} placeholder="0.00" className="pl-8" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="visaMastercardVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visa/Mastercard Volume</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <FormControl>
                    <Input {...field} placeholder="0.00" className="pl-8" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amexVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>American Express Volume</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <FormControl>
                    <Input {...field} placeholder="0.00" className="pl-8" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="averageTicket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Ticket</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <FormControl>
                    <Input {...field} placeholder="0.00" className="pl-8" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="highestTicket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highest Ticket</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <FormControl>
                    <Input {...field} placeholder="0.00" className="pl-8" />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>

        <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">10. Transaction Method (Must Equal 100%)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="faceToFacePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Face-to-Face (Retail)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="0" className="pr-8" />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="motoPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone/Mail/Email (MOTO)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="0" className="pr-8" />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ecommercePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internet (eCommerce)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="0" className="pr-8" />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
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
