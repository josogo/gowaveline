
import { supabase } from '@/integrations/supabase/client';
import { base64ToBlob } from './utils';

export async function generatePreApp(
  industryId: string,
  leadData: any,
  formData: any
): Promise<any> {
  try {
    console.log('[GENERATE_PRE_APP] Starting generatePreApp function with industry:', industryId);
    
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
      const errorText = await response.text();
      console.error('[GENERATE_PRE_APP] Error response:', errorText);
      throw new Error(`PDF generation failed: Server returned ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('[GENERATE_PRE_APP] Raw response length:', responseText.length);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response received from PDF generation service');
    }
    
    console.log('[GENERATE_PRE_APP] Response starts with:', responseText.substring(0, 100));
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[GENERATE_PRE_APP] Error parsing response as JSON:', parseError);
      throw new Error(`Failed to parse response from PDF generation service: ${responseText.substring(0, 100)}...`);
    }
    
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
      }
    } catch (convertError) {
      console.error('[GENERATE_PRE_APP] Error converting base64 to blob:', convertError);
      throw new Error(`Invalid PDF data format: ${convertError.message}`);
    }
    
    console.log('[GENERATE_PRE_APP] PDF base64 string length:', result.pdfBase64.length);
    console.log('[GENERATE_PRE_APP] PDF generated successfully');
    
    return {
      success: true,
      pdfBase64: result.pdfBase64,
      businessName: result.businessName || formData.businessName || 'merchant-application'
    };
    
  } catch (error: any) {
    console.error('[GENERATE_PRE_APP] Error generating pre-app document:', error);
    throw error;
  }
}
