
import { supabase } from '@/integrations/supabase/client';
import { base64ToBlob } from './utils';

/**
 * Generates a pre-application PDF from the provided data
 * 
 * @param industryId The ID of the industry for the application
 * @param leadData Any lead data to include in the application
 * @param formData Form data to include in the application
 * @returns Promise containing success flag, PDF data, and business name
 */
export async function generatePreApp(
  industryId: string,
  leadData: any,
  formData: any
): Promise<any> {
  try {
    console.log('[GENERATE_PRE_APP] Starting generatePreApp function with industry:', industryId);
    
    // Validate input parameters
    if (!industryId) {
      throw new Error('Industry ID is required');
    }
    
    if (!formData) {
      throw new Error('Form data is required');
    }
    
    const edgeFunctionUrl = 'https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/generate-pre-app';
    console.log('[GENERATE_PRE_APP] Calling edge function URL:', edgeFunctionUrl);
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ industryId, formData })
    });
    
    console.log('[GENERATE_PRE_APP] Edge function response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `PDF generation failed: Server returned ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Fall back to the text if we can't parse JSON
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      
      console.error('[GENERATE_PRE_APP] Error response:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Get the raw text response first to validate its structure
    const responseText = await response.text();
    console.log('[GENERATE_PRE_APP] Raw response length:', responseText.length);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response received from PDF generation service');
    }
    
    console.log('[GENERATE_PRE_APP] Response starts with:', responseText.substring(0, 100));
    
    // Parse the response as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[GENERATE_PRE_APP] Error parsing response as JSON:', parseError);
      throw new Error(`Failed to parse response from PDF generation service: ${responseText.substring(0, 100)}...`);
    }
    
    // Validate the response structure
    if (!result.success) {
      const errorMessage = result?.error || 'Unknown error occurred';
      console.error('[GENERATE_PRE_APP] Error in response:', result);
      throw new Error(`PDF generation failed: ${errorMessage}`);
    }
    
    if (!result.pdfBase64) {
      console.error('[GENERATE_PRE_APP] No PDF data in response:', result);
      throw new Error('No PDF data received from the server');
    }
    
    // Validate the base64 string
    if (typeof result.pdfBase64 !== 'string' || result.pdfBase64.trim() === '') {
      console.error('[GENERATE_PRE_APP] Invalid PDF base64 data:', typeof result.pdfBase64);
      throw new Error('Invalid PDF data received from the server');
    }
    
    // Test the conversion to make sure the base64 is valid
    try {
      const testBlob = base64ToBlob(result.pdfBase64, 'application/pdf');
      console.log('[GENERATE_PRE_APP] PDF blob created successfully with size:', testBlob.size);
      if (testBlob.size < 100) {
        console.warn('[GENERATE_PRE_APP] Warning: PDF blob size is very small:', testBlob.size);
        
        if (testBlob.size === 0) {
          throw new Error('Generated PDF has zero size');
        }
      }
    } catch (convertError: any) {
      console.error('[GENERATE_PRE_APP] Error converting base64 to blob:', convertError);
      throw new Error(`Invalid PDF data format: ${convertError.message}`);
    }
    
    console.log('[GENERATE_PRE_APP] PDF base64 string length:', result.pdfBase64.length);
    console.log('[GENERATE_PRE_APP] PDF generated successfully');
    
    const businessName = result.businessName || formData.businessName || 'merchant-application';
    console.log('[GENERATE_PRE_APP] Using business name for file:', businessName);
    
    return {
      success: true,
      pdfBase64: result.pdfBase64,
      businessName: businessName
    };
    
  } catch (error: any) {
    console.error('[GENERATE_PRE_APP] Error generating pre-app document:', error);
    throw error;
  }
}
