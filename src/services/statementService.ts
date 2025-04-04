
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
      throw new Error(`Failed to analyze statement: ${analysisError.message}`);
    }
    
    if (!analysisData || !analysisData.success) {
      console.error('No analysis data returned or analysis unsuccessful');
      throw new Error('Analysis failed: No valid data returned from the analysis function');
    }
    
    console.log("Analysis data received:", analysisData);
    onProgress(100); // Analysis complete
    
    // Clean up the uploaded file after analysis
    console.log("Cleaning up uploaded file");
    await supabase.storage
      .from('statements')
      .remove([fileName]);
    
    // Force isMockData to FALSE for real data
    return {
      ...analysisData,
      isMockData: false
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error; // We rethrow the error to be handled by the caller
  }
};
