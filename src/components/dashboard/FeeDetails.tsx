
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeeStructure } from '@/services/statementService';

interface FeeDetailsProps {
  fees: FeeStructure;
  pricingModel: string;
  effectiveRate: string;
}

const FeeDetails: React.FC<FeeDetailsProps> = ({ fees, pricingModel, effectiveRate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Details</CardTitle>
        <CardDescription>
          Breakdown of all fees from your merchant statement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium">Monthly Fee</h3>
              <p className="text-2xl font-bold text-orange-500">{fees.monthlyFee}</p>
              <p className="text-sm text-muted-foreground mt-1">Account maintenance fee</p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-medium">PCI Compliance Fee</h3>
              <p className="text-2xl font-bold text-teal-500">{fees.pciFee}</p>
              <p className="text-sm text-muted-foreground mt-1">Security compliance cost</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium">Statement Fee</h3>
              <p className="text-2xl font-bold text-orange-500">{fees.statementFee}</p>
              <p className="text-sm text-muted-foreground mt-1">Paper statement charge</p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-medium">Batch Fee</h3>
              <p className="text-2xl font-bold text-teal-500">{fees.batchFee}</p>
              <p className="text-sm text-muted-foreground mt-1">Per batch settlement</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium">Transaction Fees</h3>
              <p className="text-2xl font-bold text-orange-500">{fees.transactionFees}</p>
              <p className="text-sm text-muted-foreground mt-1">Per transaction cost</p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-medium">Potential Savings</h3>
              <p className="text-2xl font-bold text-teal-500">$175-$320</p>
              <p className="text-sm text-muted-foreground mt-1">Estimated monthly savings</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <h3 className="font-medium text-orange-800">Analysis Summary</h3>
            <p className="mt-2">
              Based on your {pricingModel} pricing model with an effective rate of {effectiveRate}, we estimate you could save approximately 15-25% on your processing costs by switching to an interchange-plus pricing model. Additionally, some of your non-processing fees like PCI compliance ({fees.pciFee}) and statement fee ({fees.statementFee}) are higher than the industry standard.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeDetails;
