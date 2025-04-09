
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { TeamMemberFormData } from './types';

interface RoleFieldProps {
  form: UseFormReturn<TeamMemberFormData>;
}

export const RoleField: React.FC<RoleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Sales Representative">Sales Representative</SelectItem>
              <SelectItem value="Account Manager">Account Manager</SelectItem>
              <SelectItem value="Sales Manager">Sales Manager</SelectItem>
              <SelectItem value="Team Lead">Team Lead</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
