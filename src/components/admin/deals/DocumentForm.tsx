
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['statement', 'bank', 'corp_docs', 'license', 'void_check', 'tax_return', 'other']),
  file: z.any().optional()
});

export type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  onSubmit: (values: DocumentFormValues) => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      type: 'statement'
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
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter document name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="statement">Merchant Statement</SelectItem>
                  <SelectItem value="bank">Bank Statement</SelectItem>
                  <SelectItem value="corp_docs">Corporation Documents</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="void_check">Void Check</SelectItem>
                  <SelectItem value="tax_return">Tax Return</SelectItem>
                  <SelectItem value="other">Other Document</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  className="cursor-pointer" 
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Upload Document</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DocumentForm;
