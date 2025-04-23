
import React from 'react';
import { StatementAnalysis } from '@/services/statementService';
import NoDataAlert from '@/components/dashboard/NoDataAlert';
import StatementDataAlert from '@/components/dashboard/StatementDataAlert';
import MetricCards from '@/components/dashboard/MetricCards';
import FeeDetails from '@/components/dashboard/FeeDetails';

interface DashboardProps {
  analysisData: StatementAnalysis;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisData }) => {
  // Get appropriate additional info for each metric
  const getAdditionalInfo = (field: string) => {
    switch (field) {
      case 'effectiveRate':
        return analysisData.effectiveRate !== "N/A" 
          ? "Industry average is 2.5-3.0%" 
          : "Could not calculate from statement";
      case 'monthlyVolume':
        return analysisData.monthlyVolume !== "N/A"
          ? "Your total processing for this period"
          : "Most statements don't clearly show this value";
      case 'pricingModel':
        return analysisData.pricingModel !== "N/A"
          ? "Interchange-plus typically saves 15-30%"
          : "Could not determine from statement";
      case 'chargebackRatio':
        return analysisData.chargebackRatio !== "N/A"
          ? "Industry average is around 0.60%"
          : "Could not calculate from statement";
      default:
        return "";
    }
  };
  
  // Check if we have any real data at all
  const hasNoRealData = 
    analysisData.effectiveRate === "N/A" && 
    analysisData.monthlyVolume === "N/A" && 
    analysisData.pricingModel === "N/A" &&
    analysisData.chargebackRatio === "N/A" && 
    analysisData.fees.monthlyFee === "N/A" &&
    analysisData.fees.pciFee === "N/A" &&
    analysisData.fees.statementFee === "N/A" &&
    analysisData.fees.batchFee === "N/A" &&
    analysisData.fees.transactionFees === "N/A";

  return (
    <div className="container mx-auto py-8 px-4">
      {hasNoRealData && <NoDataAlert />}
      
      <MetricCards 
        analysisData={analysisData}
        getAdditionalInfo={getAdditionalInfo}
      />
      
      <StatementDataAlert 
        showVolumeNote={analysisData.monthlyVolume === "N/A"} 
      />
      
      {/* Fee Details */}
      <FeeDetails 
        fees={analysisData.fees} 
        pricingModel={analysisData.pricingModel} 
        effectiveRate={analysisData.effectiveRate} 
      />
    </div>
  );
};

export default Dashboard;
