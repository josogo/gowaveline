
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
    console.log(`Starting document upload for application ${applicationId}`, { fileName, documentType });
    
    // First try using the edge function with auth token
    try {
      console.log(`Trying edge function upload for ${fileName}`);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        console.warn('No auth token available for edge function call');
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
      console.log('Document uploaded via edge function:', result);
      return { data: result.data, error: null };
    } catch (edgeFunctionError) {
      console.warn('Edge function upload failed, trying standard insert:', edgeFunctionError);
      
      // Try standard insert as fallback
      const { data, error } = await supabase
        .from('merchant_documents')
        .insert({
          merchant_id: applicationId,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          file_path: filePath,
          document_type: documentType,
          uploaded_by: 'web_app'
        })
        .select();
      
      if (error) {
        console.error('Standard insert error:', error);
        // Try direct API call as final fallback
        const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/merchant_documents', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            merchant_id: applicationId,
            file_name: fileName,
            file_type: fileType,
            file_size: fileSize,
            file_path: filePath,
            document_type: documentType,
            uploaded_by: 'web_app'
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('REST API error:', errorText);
          throw new Error(`REST API error: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Document uploaded via REST API:', responseData);
        return { data: responseData, error: null };
      }
      
      console.log('Document uploaded via standard insert:', data);
      return { data, error: null };
    }
  } catch (error: any) {
    console.error('Document upload error:', error);
    return { data: null, error };
  }
};

export const fetchMerchantDocuments = async (applicationId: string) => {
  try {
    console.log(`Fetching documents for application ${applicationId}`);
    
    // Try using edge function first
    try {
      console.log('Trying edge function for fetching documents');
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        console.warn('No auth token available for edge function call');
        throw new Error('Authentication required to fetch documents');
      }
      
      const response = await fetch(`https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/get-merchant-documents?applicationId=${applicationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Edge function error: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Documents fetched via edge function:', result.documents);
      return { data: result.documents, error: null };
    } catch (edgeFunctionError) {
      console.warn('Edge function fetch failed, trying standard query:', edgeFunctionError);
      
      // Try standard RLS-compliant query as fallback
      const { data, error } = await supabase
        .from('merchant_documents')
        .select('*')
        .eq('merchant_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Standard fetch error:', error);
        // Try direct API call as final fallback
        const response = await fetch(
          `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/merchant_documents?merchant_id=eq.${applicationId}&order=created_at.desc`,
          {
            method: 'GET',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('REST API error:', errorText);
          throw new Error(`REST API error: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Documents fetched via REST API:', responseData);
        return { data: responseData, error: null };
      }
      
      console.log('Documents fetched via standard query:', data);
      return { data, error: null };
    }
  } catch (error) {
    console.error('Error fetching merchant documents:', error);
    return { data: null, error };
  }
};
