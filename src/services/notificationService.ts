
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

export async function sendContactFormNotification(contactData: {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  partnerType?: string;
  message: string;
}) {
  try {
    // First save to Supabase
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      message: contactData.message
    });

    if (dbError) {
      console.error('Error saving contact submission to database:', dbError);
    }

    // Send email notification using edge function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify({
        type: 'contact',
        subject: `New Contact Form Submission: ${contactData.inquiryType.toUpperCase()}`,
        data: {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          inquiryType: contactData.inquiryType,
          partnerType: contactData.partnerType || 'N/A',
          message: contactData.message,
          recipient: 'info@gowaveline.com'
        }
      }),
    });
    
    if (error) {
      console.error('Error invoking send-email function:', error);
      return false;
    }
    
    console.log('Contact form notification sent successfully', data);
    return true;
  } catch (error) {
    console.error('Error sending contact form notification:', error);
    return false;
  }
}
