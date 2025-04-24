
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ClaimsAssessment = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Claims Assessment</h3>
      
      <div>
        <Label>Do your marketing materials make any claims about results, outcomes, or benefits?</Label>
        <Textarea 
          placeholder="Describe any claims made in your marketing materials"
          className={`mt-2 ${errors.marketingClaims ? 'border-red-500' : ''}`}
          {...register('marketingClaims')}
        />
        {errors.marketingClaims && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.marketingClaims.message as string}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Average Customer Acquisition Cost (CAC)</Label>
          <Input 
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className={errors.cac ? 'border-red-500' : ''}
            {...register('cac')}
          />
          {errors.cac && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.cac.message as string}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Average cost to acquire one customer
          </p>
        </div>
        
        <div>
          <Label>Customer Lifetime Value (LTV)</Label>
          <Input 
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className={errors.ltv ? 'border-red-500' : ''}
            {...register('ltv')}
          />
          {errors.ltv && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.ltv.message as string}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Average value of a customer over their lifetime
          </p>
        </div>
      </div>
    </div>
  );
};
