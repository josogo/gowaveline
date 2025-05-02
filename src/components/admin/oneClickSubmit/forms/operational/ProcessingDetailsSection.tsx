
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ProcessingDetailsSection: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Processing Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="operations.avgTicket">Average Ticket Size ($)</Label>
          <Input 
            id="operations.avgTicket"
            type="number" 
            placeholder="0.00" 
            {...register('operations.avgTicket')}
          />
        </div>
        
        <div>
          <Label htmlFor="operations.monthlyVolume">Monthly Processing Volume ($)</Label>
          <Input 
            id="operations.monthlyVolume"
            type="number" 
            placeholder="0.00" 
            {...register('operations.monthlyVolume')}
          />
        </div>
        
        <div>
          <Label htmlFor="operations.chargebackPercent">Chargeback Percentage (%)</Label>
          <Input 
            id="operations.chargebackPercent"
            type="number" 
            placeholder="0.00" 
            {...register('operations.chargebackPercent')}
          />
        </div>
        
        <div>
          <Label htmlFor="operations.refundPercent">Refund Percentage (%)</Label>
          <Input 
            id="operations.refundPercent"
            type="number" 
            placeholder="0.00" 
            {...register('operations.refundPercent')}
          />
        </div>
      </div>
    </div>
  );
};
