
import { supabase } from '@/integrations/supabase/client';

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
    
    const responseText = await response.text();
    console.log('[GENERATE_PRE_APP] Raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[GENERATE_PRE_APP] Error parsing response as JSON:', parseError);
      throw new Error(`Failed to parse response from PDF generation service: ${responseText.substring(0, 100)}...`);
    }
    
    if (!response.ok) {
      const errorMessage = result?.error || response.statusText || 'Unknown error';
      console.error('[GENERATE_PRE_APP] Error response from edge function:', { 
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      throw new Error(`PDF generation failed: ${errorMessage}`);
    }
    
    if (!result.pdfBase64) {
      console.error('[GENERATE_PRE_APP] No PDF data in response:', result);
      throw new Error('No PDF data received from the server');
    }
    
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
