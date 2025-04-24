
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

export const MarketingRiskCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-4">
          <h4 className="font-medium flex items-center text-amber-600">
            <XCircle className="h-4 w-4 mr-2" />
            High-Risk Claims to Avoid
          </h4>
          <ul className="mt-2 space-y-2 text-sm">
            {['Guaranteed results or outcomes', 
              'Risk-free trials or purchases',
              'Medical claims or health benefits',
              'Cure, treat, or prevent any disease',
              'Urgent or high-pressure sales tactics'
            ].map((claim, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full p-1 mr-2 mt-0.5">
                  <XCircle className="h-3 w-3" />
                </span>
                <span>{claim}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-4">
          <h4 className="font-medium flex items-center text-green-600">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Low-Risk Alternatives
          </h4>
          <ul className="mt-2 space-y-2 text-sm">
            {['"May help with..." statements',
              '"Satisfaction guarantee" with clear terms',
              'Customer testimonials with disclaimers',
              'Transparent pricing and trial terms',
              'Educational content about your products'
            ].map((alternative, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                <span>{alternative}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
