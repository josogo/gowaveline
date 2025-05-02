
import { supabase } from "@/integrations/supabase/client";

/**
 * Insert a merchant application progress record.
 */
export async function createMerchantApplication(appData: {
  applicationData: any;
  merchantName: string;
  merchantEmail: string;
  otp: string;
  expiresAt: string;
  applicationId: string;
}) {
  // Get the next application number
  const { data: nextNumData, error: countError } = await supabase
    .from("merchant_applications")
    .select("application_number")
    .order("application_number", { ascending: false })
    .limit(1);
    
  // Safely handle the application number, even if it doesn't exist in the table yet
  let nextApplicationNumber = 1;
  if (nextNumData && nextNumData.length > 0 && nextNumData[0]?.application_number) {
    nextApplicationNumber = parseInt(nextNumData[0].application_number) + 1;
  }

  const formattedNumber = nextApplicationNumber.toString().padStart(6, '0');

  const { error } = await supabase.from("merchant_applications").insert({
    id: appData.applicationId,
    application_data: appData.applicationData,
    merchant_name: appData.merchantName,
    merchant_email: appData.merchantEmail,
    otp: appData.otp,
    expires_at: appData.expiresAt,
    application_number: formattedNumber
  });
  
  return { error, applicationNumber: formattedNumber };
}

/**
 * Look up a merchant application's OTP and return status/data.
 */
export async function validateMerchantLogin({
  email,
  otp,
  applicationId,
}: { email: string; otp: string; applicationId?: string }) {
  let query = supabase.from("merchant_applications")
    .select("*")
    .eq("merchant_email", email)
    .eq("otp", otp)
    .eq("completed", false);

  if (applicationId) {
    query = query.eq("id", applicationId);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    return { valid: false, error: error?.message || "Invalid email or OTP" };
  }

  const expired = new Date(data.expires_at) < new Date();
  if (expired) {
    return { valid: false, error: "This code has expired. Please request a new link." };
  }
  return { valid: true, application: data };
}

/**
 * Mark a merchant application as completed (invalidate OTP).
 */
export async function completeMerchantApplication(id: string) {
  return supabase
    .from("merchant_applications")
    .update({ completed: true, updated_at: new Date().toISOString() })
    .eq("id", id);
}

/**
 * Interface defining document upload parameters
 */
export interface MerchantDocumentParams {
  applicationId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: string;
  uploadedBy?: string;
}

/**
 * Upload a document for a merchant application
 * Enhanced version with better error handling
 */
export const uploadMerchantDocument = async (params: MerchantDocumentParams) => {
  console.log('Saving document metadata to database:', params);
  
  try {
    const { data, error } = await supabase
      .from('merchant_documents')
      .insert({
        merchant_id: params.applicationId,
        file_name: params.fileName,
        file_type: params.fileType,
        file_size: params.fileSize,
        file_path: params.filePath,
        document_type: params.documentType,
        uploaded_by: params.uploadedBy || 'merchant',
      });
    
    if (error) {
      console.error('Error saving document metadata:', error);
      return { error };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error('Exception in uploadMerchantDocument:', err);
    return { data: null, error: err };
  }
};

/**
 * Get documents for a merchant application
 * Enhanced version with better error handling
 */
export const getMerchantDocuments = async (applicationId: string) => {
  console.log('Getting documents for application:', applicationId);
  
  try {
    const { data, error } = await supabase
      .from('merchant_documents')
      .select('*')
      .eq('merchant_id', applicationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      return { error };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error('Exception in getMerchantDocuments:', err);
    return { data: null, error: err };
  }
};
