
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const BusinessCardUsageTips: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Users className="h-5 w-5" />
          Usage Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-green-700">
          <p>
            <strong>Professional Printing:</strong> Use the template with any professional printer or online print service - 
            the colors and margins are pre-configured for accurate printing.
          </p>
          <p>
            <strong>Personal Touch:</strong> On the back of your card, you can jot a quick note or appointment time 
            for prospects - a personal touch plus the branded card makes a lasting impression.
          </p>
          <p>
            <strong>Always Carry:</strong> We recommend every agent carry these cards when meeting potential clients 
            or attending industry events. They're perfect leave-behinds along with the one-page flyers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
