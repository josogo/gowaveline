import React from 'react';
import { StatementAnalysis } from '@/services/statementService';
import MetricCard from '@/components/dashboard/MetricCard';
import FeeDetails from '@/components/dashboard/FeeDetails';
import { AlertTriangle, FileQuestion, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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

  // Check if this is likely a PDF processing issue
  const isPdfProcessingIssue = 
    hasNoRealData && analysisData.error && 
    (analysisData.error.includes('PDF processing') || 
     analysisData.error.includes('Gemini') ||
     analysisData.message?.includes('PDF'));

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

      {isPdfProcessingIssue && (
        <Alert variant="warning" className="mb-8 bg-blue-50 border-blue-200">
          <FileQuestion className="h-5 w-5" />
          <AlertTitle>PDF Processing Configuration Required</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              To enable PDF processing, you need to set up Google Gemini API:
            </p>
            <ol className="list-decimal ml-5 space-y-1 mb-3">
              <li>Get a Google API key that has access to Gemini Pro Vision API</li>
              <li>Add the API key to your Supabase Edge Functions Secrets</li>
            </ol>
            <ul className="font-mono text-sm bg-blue-100 p-3 rounded-md mb-3">
              <li>GEMINI_API_KEY</li>
            </ul>
            <p className="text-sm">
              Until this is configured, the system will be limited to processing CSV and Excel files only.
            </p>
            <div className="mt-3">
              <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                <a href="https://supabase.com/dashboard/project/rqwrvkkfixrogxogunsk/settings/functions" target="_blank" rel="noopener noreferrer">
                  Configure in Supabase <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
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
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800 p-4 rounded-md">
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

export default Dashboard;
