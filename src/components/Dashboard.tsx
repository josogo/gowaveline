
import React from 'react';
import { StatementAnalysis } from '@/services/statementService';
import MetricCard from '@/components/dashboard/MetricCard';
import FeeBreakdownChart from '@/components/dashboard/FeeBreakdownChart';
import VolumeChart from '@/components/dashboard/VolumeChart';
import FeeDetails from '@/components/dashboard/FeeDetails';
import { feeBreakdown, monthlyData } from '@/components/dashboard/mockData';

interface DashboardProps {
  analysisData: StatementAnalysis;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisData }) => {
  // If we don't have volume data, don't show the chart
  const showVolumeChart = analysisData.monthlyVolume !== "N/A";
  
  // Don't use the mock data, instead let's customize based on the actual data
  const getAdditionalInfo = (field: string) => {
    switch (field) {
      case 'effectiveRate':
        return analysisData.effectiveRate !== "N/A" 
          ? "Industry average is 2.5-3.0%" 
          : "Could not calculate from statement";
      case 'monthlyVolume':
        return analysisData.monthlyVolume !== "N/A"
          ? "Your total processing for this period"
          : "Could not extract from statement";
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

  return (
    <div className="container mx-auto py-8 px-4">
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
          valueClassName={analysisData.monthlyVolume === "N/A" ? "text-gray-500" : "text-teal-500"}
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
          valueClassName={analysisData.chargebackRatio === "N/A" ? "text-gray-500" : "text-teal-500"}
        />
      </div>
      
      {/* Only show FeeBreakdown chart if we have fee data */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <Alert variant="info" className="bg-blue-50 border-blue-200 text-blue-800 p-4 rounded-md">
          <h3 className="font-medium mb-2">Statement Data</h3>
          <p>
            We've extracted all the information we could find in your statement. 
            Fields marked "N/A" could not be found in the document you uploaded.
          </p>
        </Alert>
      </div>
      
      {/* Fee Details */}
      <FeeDetails 
        fees={analysisData.fees} 
        pricingModel={analysisData.pricingModel} 
        effectiveRate={analysisData.effectiveRate} 
      />
    </div>
  );
};

// Helper Alert component
const Alert = ({ children, variant, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant: string }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export default Dashboard;
