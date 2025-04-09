
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { TeamMemberFormData } from './types';

interface SalesInfoFieldsProps {
  form: UseFormReturn<TeamMemberFormData>;
}

export const SalesInfoFields: React.FC<SalesInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="commissionSplit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission Split</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select %" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30%">30%</SelectItem>
                  <SelectItem value="35%">35%</SelectItem>
                  <SelectItem value="40%">40%</SelectItem>
                  <SelectItem value="50%">50%</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                Based on volume tier
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="processingVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Volume</FormLabel>
              <FormControl>
                <Input placeholder="100,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="revenueVolume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Revenue Volume</FormLabel>
            <FormControl>
              <Input placeholder="25,000" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Annual revenue from accounts
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
