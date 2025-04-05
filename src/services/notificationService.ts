
import { toast } from "sonner";

export async function sendEmailNotification(fileData: File, contactData?: {
  companyName?: string;
  email?: string;
  phone?: string;
}) {
  try {
    // Mock successful response for testing
    console.log('Mock email notification sending:', {
      file: fileData.name,
      contactData
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}
