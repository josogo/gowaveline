
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  type: string;
  subject: string;
  data: Record<string, string | number | boolean>;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
// Use this email for testing - this should be your verified email in Resend
const TEST_EMAIL = "jordan@gowaveline.com";
// Set to true to use the test email for all recipients during development
const USE_TEST_EMAIL = true;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if RESEND_API_KEY is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service is not properly configured. RESEND_API_KEY is missing." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const { type, subject, data } = await req.json() as EmailData;

    // For now, we're just logging the data
    // In a production environment, this would send an actual email
    console.log(`Email type: ${type}`);
    console.log(`Subject: ${subject}`);
    console.log("Data:", data);

    // Email content based on type
    let htmlContent = '';
    let recipient = 'admin@example.com';
    
    // Different handling based on email type
    if (type === 'statement') {
      // Statement analysis email logic
      console.log("Processing statement analysis request");
      htmlContent = `
        <h1>New Statement Analysis Request</h1>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>File Name:</strong> ${data.fileName}</p>
        <p><strong>File Type:</strong> ${data.fileType}</p>
        <p><strong>File Size:</strong> ${data.fileSize} bytes</p>
      `;
      recipient = 'info@gowaveline.com';
      
    } else if (type === 'contact') {
      // Contact form submission logic
      console.log("Processing contact form submission");
      htmlContent = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Inquiry Type:</strong> ${data.inquiryType}</p>
        ${data.partnerType ? `<p><strong>Partner Type:</strong> ${data.partnerType}</p>` : ''}
        <h2>Message:</h2>
        <p>${data.message}</p>
      `;
      
      // If recipient is specified in data, use it, otherwise default
      recipient = data.recipient ? String(data.recipient) : 'info@gowaveline.com';
      
    } else if (type === 'getStarted') {
      // Get Started form submission logic
      console.log("Processing get started submission");
      htmlContent = `
        <h1>New Get Started Application</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Business:</strong> ${data.businessName}</p>
        <p><strong>Website:</strong> ${data.website || 'Not provided'}</p>
        <p><strong>Monthly Volume:</strong> ${data.monthlyVolume}</p>
        
        ${data.hasAttachment ? `
        <h2>Attached Statement</h2>
        <p><strong>File:</strong> ${data.fileName}</p>
        <p><strong>File Type:</strong> ${data.fileType}</p>
        <p><strong>File Size:</strong> ${(Number(data.fileSize) / (1024 * 1024)).toFixed(2)} MB</p>
        <p><a href="${data.fileUrl}" target="_blank">Download Statement</a> (link valid for 7 days)</p>
        ` : '<p>No statement file was uploaded.</p>'}
      `;
      recipient = data.recipient ? String(data.recipient) : 'info@gowaveline.com';
      console.log(`GetStarted form - sending to recipient: ${recipient}`);
      
    } else if (type === 'quiz') {
      // Quiz results submission logic
      console.log("Processing quiz results submission");
      htmlContent = `
        <h1>Quiz Result - Lesson ${data.lessonId}</h1>
        <p><strong>User ID:</strong> ${data.userId}</p>
        <p><strong>Score:</strong> ${data.score} out of ${data.totalQuestions}</p>
        <p><strong>Percentage:</strong> ${data.percentage}%</p>
        <p><strong>Correct Answers:</strong> ${data.correctAnswers}</p>
        <p><strong>Incorrect Answers:</strong> ${data.incorrectAnswers}</p>
      `;
      recipient = 'info@gowaveline.com';
    }

    // If we're in testing mode, override the recipient
    if (USE_TEST_EMAIL) {
      console.log(`Using test email instead of ${recipient}`);
      recipient = TEST_EMAIL;
    }

    // Use RESEND API to send the email
    try {
      console.log(`Attempting to send email to: ${recipient}`);
      
      // Set up the from email address - for production this should be from your verified domain
      const fromEmail = USE_TEST_EMAIL 
        ? "Waveline Test <onboarding@resend.dev>"
        : "Waveline <onboarding@resend.dev>"; 
      
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipient],
          subject: subject,
          html: htmlContent || `<p>New ${type} submission received:</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>`,
        }),
      });
      
      const responseData = await emailResponse.json();
      console.log("Email API response:", responseData);
      
      if (!emailResponse.ok) {
        throw new Error(`Resend API returned ${emailResponse.status}: ${JSON.stringify(responseData)}`);
      }

      // Store the form data in a database or log it for backup
      console.log("Form data processed successfully:", {
        type,
        subject,
        recipient,
        ...data
      });

      return new Response(JSON.stringify({ 
        success: true, 
        message: `Email sent successfully to ${recipient}` 
      }), {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.error("Error sending with Resend:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
