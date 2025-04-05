
import { toast } from "sonner";

export async function sendEmailNotification(fileData: File, contactData?: {
  companyName?: string;
  email?: string;
  phone?: string;
}) {
  try {
    const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send email notification:', errorData);
      return false;
    } else {
      console.log('Email notification sent successfully');
      return true;
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}
