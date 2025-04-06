
import { supabase } from '@/integrations/supabase/client';

export async function sendEmailNotification(fileData: File, contactData?: {
  companyName?: string;
  email?: string;
  phone?: string;
}) {
  try {
    // Send notification using edge function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify({
        type: 'statement',
        subject: 'New Statement Analysis Request',
        data: {
          company: contactData?.companyName || 'No company provided',
          email: contactData?.email || 'No email provided',
          phone: contactData?.phone || 'No phone provided',
          fileName: fileData.name,
          fileType: fileData.type,
          fileSize: fileData.size,
        }
      }),
    });
    
    if (error) {
      console.error('Error invoking send-email function:', error);
      return false;
    }
    
    console.log('Email notification sent successfully', data);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}
