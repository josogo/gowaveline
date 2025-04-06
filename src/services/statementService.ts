
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

// Types for analysis results
export interface FeeStructure {
  monthlyFee: string;
  pciFee: string;
  statementFee: string;
  batchFee: string;
  transactionFees: string;
}

export interface StatementAnalysis {
  success: boolean;
  effectiveRate: string;
  monthlyVolume: string;
  chargebackRatio: string;
  pricingModel: string;
  fees: FeeStructure;
  error?: string;
  message?: string;
}

/**
 * Analyzes a merchant statement using Supabase Edge Function
 * For testing: returns mock data instead of actual analysis
 */
export const analyzeStatement = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<StatementAnalysis> => {
  try {
    // Log file details for debugging
    console.log("analyzeStatement called with file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    // Start progress
    onProgress(10);
    console.log("Starting file upload process for analysis", { fileName: file.name, fileType: file.type, fileSize: file.size });
    
    // Simulate upload delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 1000));
    onProgress(30);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onProgress(50);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    onProgress(70);
    
    // Simulate final processing
    await new Promise(resolve => setTimeout(resolve, 800));
    onProgress(100);
    
    // Return mock successful data
    const analysisResult = {
      success: true,
      effectiveRate: "2.75%",
      monthlyVolume: "$45,230.50",
      chargebackRatio: "0.12%",
      pricingModel: "Interchange Plus",
      fees: {
        monthlyFee: "$25.00",
        pciFee: "$19.95",
        statementFee: "$10.00",
        batchFee: "$0.25",
        transactionFees: "$0.10 + 0.25%"
      },
      message: "Analysis successful! This is test data for demonstration purposes."
    };
    
    console.log("Analysis result:", analysisResult);
    toast.success("Analysis complete!");
    return analysisResult;
    
  } catch (error) {
    console.error('Statement analysis error:', error);
    
    // Even for testing, we should handle errors gracefully
    toast.error("There was a problem analyzing your statement.");
    
    // Return a failure response with N/A values
    return {
      success: false,
      effectiveRate: "N/A",
      monthlyVolume: "N/A",
      chargebackRatio: "N/A",
      pricingModel: "N/A",
      fees: {
        monthlyFee: "N/A",
        pciFee: "N/A",
        statementFee: "N/A",
        batchFee: "N/A",
        transactionFees: "N/A"
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "We couldn't analyze your statement. For better results, you can email your statement for a custom analysis."
    };
  }
};
