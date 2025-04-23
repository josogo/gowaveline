
import React from 'react';
import { StatementAnalysis } from '@/services/statementService';
import MetricCard from './MetricCard';

interface MetricCardsProps {
  analysisData: StatementAnalysis;
  getAdditionalInfo: (field: string) => string;
}

const MetricCards = ({ analysisData, getAdditionalInfo }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Effective Rate"
        description="Overall processing cost"
        value={analysisData.effectiveRate}
        additionalInfo={getAdditionalInfo('effectiveRate')}
        valueClassName={analysisData.effectiveRate === "N/A" ? "text-gray-500" : "text-orange-500"}
      />
      
      <MetricCard
        title="Monthly Volume"
        description="Total processed amount"
        value={analysisData.monthlyVolume}
        additionalInfo={getAdditionalInfo('monthlyVolume')}
        valueClassName={analysisData.monthlyVolume === "N/A" ? "text-gray-500" : "text-[#0EA5E9]"}
      />
      
      <MetricCard
        title="Pricing Model"
        description="Your pricing structure"
        value={analysisData.pricingModel}
        additionalInfo={getAdditionalInfo('pricingModel')}
        valueClassName={analysisData.pricingModel === "N/A" ? "text-gray-500" : "text-orange-500"}
      />
      
      <MetricCard
        title="Chargeback Ratio"
        description="Disputes percentage"
        value={analysisData.chargebackRatio}
        additionalInfo={getAdditionalInfo('chargebackRatio')}
        valueClassName={analysisData.chargebackRatio === "N/A" ? "text-gray-500" : "text-[#0EA5E9]"}
      />
    </div>
  );
};

export default MetricCards;
