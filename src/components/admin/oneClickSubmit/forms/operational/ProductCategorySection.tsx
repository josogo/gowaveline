
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const ProductCategorySection: React.FC = () => {
  const { register, setValue, watch } = useFormContext();
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    console.log(`Setting operations.${field} to:`, value);
    setValue(`operations.${field}`, value, { shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Product/Service Category</Label>
        <Select 
          defaultValue={watch('operations.productCategory')}
          onValueChange={(value) => handleSelectChange('productCategory', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cbd">CBD & Hemp Products</SelectItem>
            <SelectItem value="nutra">Nutraceuticals</SelectItem>
            <SelectItem value="subscription">Subscription Box</SelectItem>
            <SelectItem value="vape">Vape Products</SelectItem>
            <SelectItem value="adult">Adult Products</SelectItem>
            <SelectItem value="gaming">Gaming & Gambling</SelectItem>
            <SelectItem value="debt">Debt Collection</SelectItem>
            <SelectItem value="financial">Financial Services</SelectItem>
            <SelectItem value="other">Other High-Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="operations.mccCode">MCC Code</Label>
        <Input 
          id="operations.mccCode"
          placeholder="Enter 4-digit MCC code" 
          {...register('operations.mccCode')}
        />
        <p className="text-xs text-muted-foreground mt-1">
          If unsure, our AI will suggest appropriate MCC codes
        </p>
      </div>
      
      <div>
        <Label htmlFor="operations.naicsCode">NAICS Code</Label>
        <Input 
          id="operations.naicsCode"
          placeholder="Enter 6-digit NAICS code" 
          {...register('operations.naicsCode')}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Will be auto-detected based on your business description
        </p>
      </div>
      
      <div>
        <Label htmlFor="operations.businessDescription">Business Description</Label>
        <Textarea 
          id="operations.businessDescription"
          placeholder="Describe your products or services in detail" 
          {...register('operations.businessDescription')}
        />
      </div>
    </div>
  );
};
