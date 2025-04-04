
import { createClient } from '@supabase/supabase-js';
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
}

// Initialize Supabase client - these environment variables are automatically available
// when the app is connected to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    // First, we need to upload the file to Supabase Storage
    onProgress(10); // Start progress
    
    // Create a unique file name to avoid collisions
    const timeStamp = new Date().getTime();
    const fileName = `${timeStamp}_${file.name}`;
    
    // Upload file to Supabase Storage in a 'statements' bucket
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
    
    onProgress(50); // Update progress after upload
    
    // Get the file URL to pass to the Edge Function
    const { data: urlData } = await supabase.storage
      .from('statements')
      .createSignedUrl(fileName, 60 * 60); // URL valid for 1 hour
    
    if (!urlData || !urlData.signedUrl) {
      throw new Error('Failed to get signed URL for the uploaded file');
    }
    
    const fileUrl = urlData.signedUrl;
    onProgress(60); // Update progress after getting URL
    
    // Call the Supabase Edge Function to analyze the statement
    const { data: analysisData, error: analysisError } = await supabase.functions
      .invoke('analyze-statement', {
        body: { fileUrl, fileName, fileType: file.type },
      });
    
    if (analysisError) {
      console.error('Error analyzing statement:', analysisError);
      throw new Error(`Failed to analyze statement: ${analysisError.message}`);
    }
    
    onProgress(100); // Analysis complete
    
    // Clean up the uploaded file after analysis (optional)
    await supabase.storage
      .from('statements')
      .remove([fileName]);
    
    return analysisData;
    
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};
