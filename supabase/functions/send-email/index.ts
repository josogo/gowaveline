
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0"; // Changed from npm: prefix which works with Deno

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

// Define email templates for different types of emails
const emailTemplates = {
  contact: (data: any) => ({
    subject: `New Contact Form Submission: ${data.name}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message || 'No message provided'}</p>
    `
  }),
  
  quiz: (data: any) => ({
    subject: `Quiz Result - Lesson ${data.lessonId}`,
    html: `
      <h1>Quiz Results</h1>
      <p><strong>Score:</strong> ${data.score} points</p>
      <p><strong>Correct Answers:</strong> ${data.correctAnswers} of ${data.totalQuestions}</p>
      <p><strong>Percentage:</strong> ${data.percentage}%</p>
    `
  }),
  
  upload: (data: any) => ({
    subject: `Document Uploaded: ${data.fileName}`,
    html: `
      <h1>New Document Upload</h1>
      <p><strong>File Name:</strong> ${data.fileName}</p>
      <p><strong>Document Type:</strong> ${data.documentType}</p>
      <p><strong>Uploaded By:</strong> ${data.uploadedBy}</p>
      <p><strong>Entity:</strong> ${data.entityType} - ${data.entityId}</p>
      <p><a href="${data.fileUrl}">Click here to view the document</a></p>
    `
  }),
  
  pdf: (data: any, fileUrl: string) => ({
    subject: `New PDF Form Submission`,
    html: `
      <h1>New Form Submission with PDF</h1>
      <p>A new form with PDF has been submitted with the following information:</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        ${Object.entries(data).map(([key, value]) => 
          `<p><strong>${key}:</strong> ${value}</p>`
        ).join('')}
      </div>
      <p>The PDF is attached to this email.</p>
    `
  })
};

// Handler function for all email-related operations
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, subject, data, attachments } = await req.json();
    
    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Default recipient for admin notifications
    const adminEmail = "admin@waveline.ai";
    
    // Select template based on email type
    const template = emailTemplates[type] ? emailTemplates[type](data) : null;
    
    if (!template) {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Prepare email options
    const emailOptions = {
      from: "Waveline <notifications@waveline.ai>",
      to: to || [adminEmail],
      subject: subject || template.subject,
      html: template.html,
      attachments: attachments || []
    };
    
    // Send the email
    const { data: emailData, error } = await resend.emails.send(emailOptions);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
