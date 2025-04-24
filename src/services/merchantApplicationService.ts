
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
 * Upload a document for a merchant application
 */
export async function uploadMerchantDocument(data: {
  applicationId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: string;
  uploadedBy?: string;
}) {
  return supabase.from("merchant_documents").insert({
    merchant_id: data.applicationId,
    file_name: data.fileName,
    file_type: data.fileType,
    file_size: data.fileSize,
    file_path: data.filePath,
    document_type: data.documentType,
    uploaded_by: data.uploadedBy || 'merchant',
  });
}

/**
 * Get documents for a merchant application
 */
export async function getMerchantDocuments(applicationId: string) {
  return supabase
    .from("merchant_documents")
    .select("*")
    .eq("merchant_id", applicationId)
    .order("created_at", { ascending: false });
}
