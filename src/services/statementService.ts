
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

/**
 * Analyzes a merchant statement using backend services (Google Cloud Document AI and OpenAI)
 * @param file The statement file to analyze
 * @param onProgress Callback function to report upload/processing progress
 * @returns Promise with analysis results
 */
export const analyzeStatement = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<StatementAnalysis> => {
  // Create form data to send file
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Configure fetch with progress reporting capability
    const xhr = new XMLHttpRequest();
    
    // Create a promise to handle the XHR response
    const uploadPromise = new Promise<StatementAnalysis>((resolve, reject) => {
      // Handle progress events
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressPercent = Math.round((event.loaded / event.total) * 100);
          onProgress(progressPercent > 90 ? 90 : progressPercent); // Cap at 90% until processing completes
        }
      });
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            onProgress(100); // Set progress to 100% when complete
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error occurred'));
      xhr.ontimeout = () => reject(new Error('Request timed out'));
    });
    
    // In a production app, this would be a real endpoint:
    // const API_ENDPOINT = 'https://api.yourdomain.com/analyze-statement';
    
    // For development purposes, we'll use a mock API for now:
    const API_ENDPOINT = 'https://mock-api-endpoint.com/analyze-statement';
    
    xhr.open('POST', API_ENDPOINT, true);
    xhr.timeout = 120000; // 2 minute timeout
    xhr.send(formData);
    
    // While waiting for the real API implementation, we'll simulate a response
    // Remove this in production and use the real uploadPromise
    await new Promise(resolve => setTimeout(resolve, 3000));
    onProgress(95); // Simulate processing
    
    // Mock successful response - this would come from the API in production
    const mockData: StatementAnalysis = {
      success: true,
      effectiveRate: '2.95%',
      monthlyVolume: '$125,780',
      chargebackRatio: '0.15%',
      pricingModel: 'Tiered',
      fees: {
        monthlyFee: '$9.95',
        pciFee: '$14.95',
        statementFee: '$7.50',
        batchFee: '$0.25',
        transactionFees: '$0.10 per transaction'
      }
    };
    
    return mockData;
    
    // In production, use this instead of the mock:
    // return await uploadPromise;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};
