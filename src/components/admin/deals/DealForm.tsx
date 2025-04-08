
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the validation schema
const dealSchema = z.object({
  name: z.string().min(1, 'Deal name is required'),
  value: z.coerce.number().min(0, 'Revenue must be a positive number'),
  processingVolume: z.coerce.number().min(0, 'Processing volume must be a positive number'),
  contactName: z.string().min(1, 'Contact name is required'),
  status: z.enum(['pending', 'closed', 'lost']),
  assignedTo: z.string().min(1, 'Assigned team member is required')
});

export type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormProps {
  defaultValues: DealFormValues;
  onSubmit: (values: DealFormValues) => void;
  onCancel: () => void;
  teamMembers: any[];
}

const DealForm: React.FC<DealFormProps> = ({ 
  defaultValues, 
  onSubmit,
  onCancel,
  teamMembers
}) => {
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      ...defaultValues,
      processingVolume: defaultValues.processingVolume || 0
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter deal name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revenue</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter revenue amount" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="processingVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Processing Volume</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter monthly processing volume" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter contact name" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deal status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to team member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-orange-500 hover:bg-orange-600"
          >
            Save Deal
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DealForm;
