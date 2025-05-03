
import { supabase } from '@/integrations/supabase/client';

interface UploadDocumentParams {
  applicationId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: string;
}

export const uploadMerchantDocument = async ({
  applicationId,
  fileName,
  fileType,
  fileSize,
  filePath,
  documentType
}: UploadDocumentParams) => {
  try {
    // First try using standard RLS-compliant insert
    try {
      const { data, error } = await supabase
        .from('merchant_documents')
        .insert({
          merchant_id: applicationId,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          file_path: filePath,
          document_type: documentType,
          uploaded_by: 'web_app' // Default uploader name
        })
        .select();
      
      if (!error) {
        console.log('Document metadata inserted successfully via standard query');
        return { data, error: null };
      }
      
      console.warn('Standard insert error (may be due to RLS):', error);
      // Continue to fallback if standard insert fails
    } catch (insertError) {
      console.warn('Standard insert exception:', insertError);
      // Proceed to fallback
    }
    
    // Fallback: Use edge function to insert data, bypassing RLS
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    if (!token) {
      throw new Error('Authentication required to upload documents');
    }
    
    // Call the upload-document edge function with auth token
    const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/upload-document', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entityId: applicationId,
        entityType: 'merchant',
        docType: documentType,
        fileName,
        fileType,
        fileSize,
        filePath,
        userName: 'web_app'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', errorText);
      throw new Error(`Document upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return { data: result, error: null };
    
  } catch (error: any) {
    console.error('Document upload error:', error);
    return { data: null, error };
  }
};

export const fetchMerchantDocuments = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from('merchant_documents')
      .select('*')
      .eq('merchant_id', applicationId)
      .order('created_at', { ascending: false });
      
    return { data, error };
  } catch (error) {
    console.error('Error fetching merchant documents:', error);
    return { data: null, error };
  }
};
