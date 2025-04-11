
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a pre-application PDF using the edge function.
 * @param industryId - The ID of the selected industry
 * @param leadData - Optional lead data to pre-populate fields
 * @param formData - Form data from the pre-application form
 */
export const generatePreApp = async (industryId: string, leadData: any, formData: any) => {
  try {
    console.log('[API] Generating pre-app with data:', { industryId, formData });
    
    const { data, error } = await supabase.functions.invoke('generate-pre-app', {
      body: { industryId, leadData, formData },
    });
    
    if (error) {
      console.error('[API] Error generating pre-app:', error);
      throw new Error(error.message || 'Failed to generate merchant application');
    }
    
    if (!data || !data.success) {
      console.error('[API] API returned unsuccessful response:', data);
      throw new Error(data?.error || 'Failed to generate merchant application');
    }
    
    console.log('[API] Successfully generated pre-app PDF');
    return data;
  } catch (error: any) {
    console.error('[API] Exception generating pre-app:', error);
    throw new Error(`Failed to generate merchant application: ${error.message}`);
  }
};
