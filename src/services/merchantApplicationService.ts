
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  try {
    // Get the next application number
    const { data: nextNumData, error: countError } = await supabase
      .from("merchant_applications")
      .select("application_number")
      .order("application_number", { ascending: false })
      .limit(1);
    
    if (countError) {
      console.error("Error getting next application number:", countError);
    }
      
    // Safely handle the application number, even if it doesn't exist in the table yet
    let nextApplicationNumber = 1;
    if (nextNumData && nextNumData.length > 0 && nextNumData[0]?.application_number) {
      nextApplicationNumber = parseInt(nextNumData[0].application_number) + 1;
    }

    const formattedNumber = nextApplicationNumber.toString().padStart(6, '0');

    const { data, error } = await supabase.from("merchant_applications").insert({
      id: appData.applicationId,
      application_data: appData.applicationData,
      merchant_name: appData.merchantName,
      merchant_email: appData.merchantEmail,
      otp: appData.otp,
      expires_at: appData.expiresAt,
      application_number: formattedNumber
    }).select();
    
    if (error) {
      console.error("Error creating merchant application:", error);
      throw error;
    }
    
    console.log("Merchant application created successfully:", data);
    return { error: null, applicationNumber: formattedNumber, data };
  } catch (error: any) {
    console.error("Exception creating merchant application:", error);
    return { error, applicationNumber: null };
  }
}

/**
 * Look up a merchant application's OTP and return status/data.
 */
export async function validateMerchantLogin({
  email,
  otp,
  applicationId,
}: { email: string; otp: string; applicationId?: string }) {
  try {
    let query = supabase.from("merchant_applications")
      .select("*")
      .eq("merchant_email", email)
      .eq("otp", otp)
      .eq("completed", false);

    if (applicationId) {
      query = query.eq("id", applicationId);
    }

    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error("Error validating merchant login:", error);
      return { valid: false, error: error.message };
    }
    
    if (!data) {
      return { valid: false, error: "Invalid email or OTP" };
    }

    const expired = new Date(data.expires_at) < new Date();
    if (expired) {
      return { valid: false, error: "This code has expired. Please request a new link." };
    }
    
    console.log("Merchant login validated successfully:", data.id);
    return { valid: true, application: data };
  } catch (error: any) {
    console.error("Exception validating merchant login:", error);
    return { valid: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Mark a merchant application as completed (invalidate OTP).
 */
export async function completeMerchantApplication(id: string) {
  try {
    const { data, error } = await supabase
      .from("merchant_applications")
      .update({ completed: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();
      
    if (error) {
      console.error("Error completing merchant application:", error);
    } else {
      console.log("Merchant application completed successfully:", id);
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Exception completing merchant application:", error);
    return { data: null, error };
  }
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
  try {
    const { data: result, error } = await supabase.from("merchant_documents").insert({
      merchant_id: data.applicationId,
      file_name: data.fileName,
      file_type: data.fileType,
      file_size: data.fileSize,
      file_path: data.filePath,
      document_type: data.documentType,
      uploaded_by: data.uploadedBy || 'merchant',
    }).select();
    
    if (error) {
      console.error("Error uploading merchant document:", error);
    } else {
      console.log("Merchant document uploaded successfully:", result);
    }
    
    return { data: result, error };
  } catch (error: any) {
    console.error("Exception uploading merchant document:", error);
    return { data: null, error };
  }
}

/**
 * Get documents for a merchant application
 */
export async function getMerchantDocuments(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from("merchant_documents")
      .select("*")
      .eq("merchant_id", applicationId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error getting merchant documents:", error);
    } else {
      console.log(`Retrieved ${data?.length || 0} documents for application: ${applicationId}`);
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Exception getting merchant documents:", error);
    return { data: null, error };
  }
}
