
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Users, Target } from 'lucide-react';

export const MarketingHeader: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-3">
            <Megaphone className="h-8 w-8" />
            Marketing Materials
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Comprehensive marketing resources for High-Risk Merchant Services Agents
          </p>
        </div>
        <Badge variant="outline" className="bg-[#0EA5E9]/10 text-[#0EA5E9] px-4 py-2">
          <Users className="h-4 w-4 mr-2" />
          Agent Resources
        </Badge>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Target className="h-6 w-6 text-orange-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Complete Marketing Toolkit
            </h3>
            <p className="text-gray-700 leading-relaxed">
              This section provides industry-specific one-page PDFs that can be printed and shared with prospective merchants, 
              as well as customizable business card templates. All materials use a friendly, informal tone to position our 
              company as a partner to merchants, highlighting our high-risk underwriting expertise and boutique, personalized 
              service that set us apart.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
