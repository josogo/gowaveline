
import React from 'react';
import { StatementAnalysis } from '@/services/statementService';
import MetricCard from '@/components/dashboard/MetricCard';
import FeeDetails from '@/components/dashboard/FeeDetails';
import { AlertTriangle } from 'lucide-react';

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
      {hasNoRealData && (
        <div className="mb-8 bg-yellow-50 border-yellow-300 border p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Limited Data Extracted</h3>
            <p className="text-yellow-700">
              We couldn't extract specific data from your statement. This might be due to the format or structure of your uploaded file.
              For better results, try uploading a CSV or Excel version of your statement.
            </p>
          </div>
        </div>
      )}
      
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
