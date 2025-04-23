
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
  const { error } = await supabase.from("merchant_applications").insert({
    id: appData.applicationId,
    application_data: appData.applicationData,
    merchant_name: appData.merchantName,
    merchant_email: appData.merchantEmail,
    otp: appData.otp,
    expires_at: appData.expiresAt,
  });
  return { error };
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
