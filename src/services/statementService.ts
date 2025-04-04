
import { supabase } from '@/integrations/supabase/client';

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
 */
export const analyzeStatement = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<StatementAnalysis> => {
  try {
    // Start progress
    onProgress(10);
    console.log("Starting file upload process for analysis", { fileName: file.name, fileType: file.type, fileSize: file.size });
    
    // Create a unique file name to avoid collisions
    const timeStamp = new Date().getTime();
    const fileName = `${timeStamp}_${file.name}`;
    
    // Upload file to Supabase Storage in a 'statements' bucket
    console.log("Uploading file to Supabase storage");
    
    // Create the statements bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const statementsBucketExists = buckets?.some(bucket => bucket.name === 'statements');
      
      if (!statementsBucketExists) {
        console.log("Creating statements bucket");
        await supabase.storage.createBucket('statements', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
      }
    } catch (error) {
      console.warn("Bucket error (may already exist):", error);
    }
    
    // Upload the file
    onProgress(30);
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
    onProgress(50);
    
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
    onProgress(70);
    
    // Call the Supabase Edge Function to analyze the statement
    console.log("Calling edge function for file analysis", {
      fileName,
      fileType: file.type,
      fileSize: file.size,
      hasUrl: Boolean(fileUrl)
    });
    
    const { data: analysisData, error: analysisError } = await supabase.functions
      .invoke('analyze-statement', {
        body: { fileUrl, fileName, fileType: file.type },
      });
    
    console.log("Response from edge function:", analysisData, analysisError);
    
    if (analysisError) {
      console.error('Error from analyze-statement function:', analysisError);
      throw new Error(`Failed to analyze statement: ${analysisError.message}`);
    }
    
    if (!analysisData) {
      console.error('No analysis data returned from function');
      throw new Error('Analysis failed: No data returned from the analysis function');
    }
    
    onProgress(100);
    
    // Clean up the uploaded file
    await supabase.storage
      .from('statements')
      .remove([fileName])
      .catch(err => console.warn("Cleanup error (non-critical):", err));
    
    return analysisData;
    
  } catch (error) {
    console.error('Statement analysis error:', error);
    
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
