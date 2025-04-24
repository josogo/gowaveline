
import React from 'react';
import { MarketingChannels } from './marketing/MarketingChannels';
import { MarketingRiskCards } from './marketing/MarketingRiskCards';
import { ClaimsAssessment } from './marketing/ClaimsAssessment';

export const MarketingForm: React.FC = () => {
  return (
    <div className="space-y-6">
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
