
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
 * Analyzes a merchant statement using Gemini AI via Supabase Edge Function
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
    console.log("Starting file upload process for analysis with Gemini");
    
    // Create a unique file name to avoid collisions
    const timeStamp = new Date().getTime();
    const fileName = `${timeStamp}_${file.name}`;
    
    // Upload file to Supabase Storage in a 'statements' bucket
    console.log("Uploading file to Supabase storage");
    
    // Create the statements bucket if it doesn't exist
    let needToCreateBucket = false;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const statementsBucketExists = buckets?.some(bucket => bucket.name === 'statements');
      needToCreateBucket = !statementsBucketExists;
    } catch (error) {
      console.error("Error checking buckets:", error);
      needToCreateBucket = true;
    }
    
    if (needToCreateBucket) {
      console.log("Creating statements bucket");
      try {
        await supabase.storage.createBucket('statements', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
      } catch (bucketError) {
        console.warn("Bucket creation error (may already exist):", bucketError);
        // Continue anyway, as the bucket might already exist but with an RLS permission issue
      }
    }
    
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
    console.log("Calling edge function to analyze statement with Gemini");
    const { data: analysisData, error: analysisError } = await supabase.functions
      .invoke('analyze-statement', {
        body: { fileUrl, fileName, fileType: file.type },
      });
    
    console.log("Response from edge function:", analysisData, analysisError);
    
    if (analysisError) {
      console.error('Error analyzing statement:', analysisError);
      
      // Check if the error might have mock data
      if (typeof analysisError === 'object' && analysisError !== null) {
        const errorString = JSON.stringify(analysisError);
        if (errorString.includes('"success":true') && errorString.includes('"isMockData":true')) {
          // Try to extract the mock data from the error
          try {
            const mockMatch = errorString.match(/\{.*\}/);
            if (mockMatch) {
              const mockData = JSON.parse(mockMatch[0]);
              if (mockData.success === true && mockData.isMockData === true) {
                console.log("Found valid mock data in error response");
                return mockData as StatementAnalysis;
              }
            }
          } catch (parseError) {
            console.error("Failed to parse mock data from error:", parseError);
          }
        }
      }
      
      throw new Error(`Failed to analyze statement: ${analysisError.message}`);
    }
    
    if (!analysisData) {
      console.error('No analysis data returned');
      throw new Error('Analysis failed: No data returned from the analysis function');
    }
    
    // Handle errors that are returned with a success:false flag
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
      .remove([fileName])
      .catch(err => console.warn("Cleanup error (non-critical):", err));
    
    // If mock data is being returned, notify the user
    if (analysisData.isMockData === true) {
      console.warn("Mock data being returned from edge function");
      toast.warning("Using simulated data for testing - the Gemini API encountered an issue processing your file.");
    }
    
    // Validate response data
    const hasSomeRealData = 
      analysisData.effectiveRate !== "N/A" || 
      analysisData.monthlyVolume !== "N/A" || 
      analysisData.pricingModel !== "N/A" ||
      analysisData.chargebackRatio !== "N/A" || 
      analysisData.fees.monthlyFee !== "N/A" ||
      analysisData.fees.pciFee !== "N/A";
      
    if (!analysisData.isMockData && !hasSomeRealData) {
      console.warn("Analysis completed but no actual data was extracted from the statement");
      toast.warning("We couldn't extract any data from your statement. Please try a different file format or contact support.");
    }
    
    return analysisData;
    
  } catch (error) {
    console.error('Analysis error:', error);
    
    // If we're catching an error with real mock data, extract and return it
    if (error instanceof Error && error.message.includes('"isMockData":true')) {
      try {
        // Try to extract JSON from the error message
        const jsonMatch = error.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const mockData = JSON.parse(jsonMatch[0]);
          if (mockData.success === true && mockData.isMockData === true) {
            console.log("Extracted mock data from error message");
            toast.warning("Using simulated data - there was an issue with the API");
            return mockData as StatementAnalysis;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse mock data from error message:", parseError);
      }
    }
    
    toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error; // We rethrow the error to be handled by the caller
  }
};
