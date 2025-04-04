
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
  isMockData: boolean; // Flag to indicate if this is mock data - always required
  error?: string; // Optional error message
  message?: string; // Optional user-friendly message
}

/**
 * Analyzes a merchant statement using backend services via Supabase Edge Function
 * @param file The statement file to analyze
 * @param onProgress Callback function to report upload/processing progress
 * @returns Promise with analysis results
 */
export const analyzeStatement = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<StatementAnalysis> => {
  try {
    // Clear any previous data
    localStorage.removeItem('statementAnalysis');
    
    // Start progress
    onProgress(10);
    console.log("Starting file upload process for real analysis");
    
    // Create a unique file name to avoid collisions
    const timeStamp = new Date().getTime();
    const fileName = `${timeStamp}_${file.name}`;
    
    // Upload file to Supabase Storage in a 'statements' bucket
    console.log("Uploading file to Supabase storage");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('statements')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
    
    console.log("File uploaded successfully:", uploadData?.path);
    onProgress(50); // Update progress after upload
    
    // Get the file URL to pass to the Edge Function
    console.log("Getting signed URL for the file");
    const { data: urlData, error: urlError } = await supabase.storage
      .from('statements')
      .createSignedUrl(fileName, 60 * 60); // URL valid for 1 hour
    
    if (urlError) {
      console.error('Error getting signed URL:', urlError);
      throw new Error(`Failed to get signed URL: ${urlError.message}`);
    }
    
    if (!urlData || !urlData.signedUrl) {
      console.error('No signed URL returned');
      throw new Error('Failed to get signed URL for the uploaded file');
    }
    
    const fileUrl = urlData.signedUrl;
    console.log("Got signed URL for the file:", fileUrl);
    onProgress(60); // Update progress after getting URL
    
    // Call the Supabase Edge Function to analyze the statement
    console.log("Calling edge function to analyze statement");
    const { data: analysisData, error: analysisError } = await supabase.functions
      .invoke('analyze-statement', {
        body: { fileUrl, fileName, fileType: file.type },
      });
    
    console.log("Response from edge function:", analysisData, analysisError);
    
    if (analysisError) {
      console.error('Error analyzing statement:', analysisError);
      
      // Special handling for PDF processing errors (422 status)
      if (file.type.includes('pdf') && analysisError.message.includes('non-2xx status code')) {
        throw new Error('PDF processing is currently unavailable. Please try uploading a CSV or Excel file instead.');
      }
      
      throw new Error(`Failed to analyze statement: ${analysisError.message}`);
    }
    
    if (!analysisData) {
      console.error('No analysis data returned');
      throw new Error('Analysis failed: No data returned from the analysis function');
    }
    
    if (!analysisData.success) {
      console.error('Analysis unsuccessful:', analysisData.error || 'Unknown error');
      
      // If there's a user-friendly message, use it
      if (analysisData.message) {
        throw new Error(analysisData.message);
      }
      
      throw new Error(`Analysis failed: ${analysisData.error || 'Unknown error'}`);
    }
    
    console.log("Analysis data received:", analysisData);
    onProgress(100); // Analysis complete
    
    // Clean up the uploaded file after analysis
    console.log("Cleaning up uploaded file");
    await supabase.storage
      .from('statements')
      .remove([fileName]);
    
    // Force isMockData to FALSE for real data
    const result: StatementAnalysis = {
      ...analysisData,
      isMockData: false
    };
    
    // Validate response data to ensure we're not getting mock data
    const hasSomeRealData = 
      result.effectiveRate !== "N/A" || 
      result.monthlyVolume !== "N/A" || 
      result.pricingModel !== "N/A" ||
      result.chargebackRatio !== "N/A" || 
      result.fees.monthlyFee !== "N/A" ||
      result.fees.pciFee !== "N/A";
      
    if (!hasSomeRealData) {
      console.warn("Analysis completed but no actual data was extracted from the statement");
      toast.warning("We couldn't extract any data from your statement. Please try a different file format or contact support.");
    }
    
    return result;
    
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error; // We rethrow the error to be handled by the caller
  }
};
