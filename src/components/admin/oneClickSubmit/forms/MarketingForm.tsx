
import React from 'react';
import { MarketingChannels } from './marketing/MarketingChannels';
import { MarketingRiskCards } from './marketing/MarketingRiskCards';
import { ClaimsAssessment } from './marketing/ClaimsAssessment';
import { useFormContext } from 'react-hook-form';
import { marketingFormSchema } from './marketing/marketingValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const MarketingForm: React.FC = () => {
  const { formState: { errors } } = useFormContext();

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors in the form before proceeding
          </AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
        Marketing practices significantly impact your risk profile. 
        High-pressure sales tactics and misleading claims can lead to higher chargebacks and payment issues.
      </p>
      
      <MarketingChannels />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Marketing Claims</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Certain marketing claims can trigger scrutiny from banks and payment processors
        </p>
        
        <MarketingRiskCards />
      </div>
      
      <ClaimsAssessment />
    </div>
  );
};

export default MarketingForm;
