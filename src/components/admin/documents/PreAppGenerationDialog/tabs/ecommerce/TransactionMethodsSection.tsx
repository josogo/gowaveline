
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface TransactionMethodsSectionProps {
  form: UseFormReturn<any>;
}

export const TransactionMethodsSection: React.FC<TransactionMethodsSectionProps> = ({ form }) => {
  return (
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
  );
};
