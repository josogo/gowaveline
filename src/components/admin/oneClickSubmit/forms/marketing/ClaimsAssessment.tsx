
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export const ClaimsAssessment = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Claims Assessment</h3>
      <div>
        <Label>Do your marketing materials make any claims about results, outcomes, or benefits?</Label>
        <Textarea 
          placeholder="Describe any claims made in your marketing materials"
          className="mt-2"
          {...register('marketingClaims')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Average Customer Acquisition Cost (CAC)</Label>
          <Input 
            type="number" 
            placeholder="0.00" 
            {...register('cac')} 
          />
          <p className="text-xs text-muted-foreground mt-1">
            Average cost to acquire one customer
          </p>
        </div>
        
        <div>
          <Label>Customer Lifetime Value (LTV)</Label>
          <Input 
            type="number" 
            placeholder="0.00" 
            {...register('ltv')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Average value of a customer over their lifetime
          </p>
        </div>
      </div>
    </div>
  );
};
