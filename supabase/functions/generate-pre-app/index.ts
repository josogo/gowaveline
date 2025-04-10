import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Pre-App PDF generation request received");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // For debugging - log headers
    console.log("Request headers:", 
      Array.from(req.headers.entries())
        .filter(([key]) => !key.toLowerCase().includes('auth'))
        .reduce((obj, [key, val]) => ({...obj, [key]: val}), {})
    );
    
    // Get request body
    const requestBody = await req.json().catch((err) => {
      console.error("Error parsing request body:", err);
      throw new Error("Invalid request body format");
    });
    
    const { industryId, leadData } = requestBody;
    
    console.log("Generating PDF for industry:", industryId);
    console.log("Lead data:", leadData || "No lead data provided");

    if (!industryId) {
      throw new Error('Industry ID is required')
    }

    // Get industry information
    const { data: industry, error: industryError } = await supabaseClient
      .from('industries')
      .select('*')
      .eq('id', industryId)
      .single();

    if (industryError) {
      console.error("Industry fetch error:", industryError);
      throw new Error(`Industry not found: ${industryError.message}`);
    }

    if (!industry) {
      console.error("Industry not found for ID:", industryId);
      throw new Error('Industry not found');
    }

    console.log("Industry found:", industry.name);

    // Get industry logo if available
    let logoImageData = null;
    try {
      const { data: logoDoc, error: logoError } = await supabaseClient
        .from('industry_documents')
        .select('*')
        .eq('industry_id', industryId)
        .eq('file_type', 'logo')
        .maybeSingle();

      if (logoDoc && !logoError) {
        console.log("Logo found:", logoDoc.file_path);
        try {
          const { data: logoData, error: logoFetchError } = await supabaseClient
            .storage
            .from('industry-files')
            .download(logoDoc.file_path);
            
          if (logoFetchError) {
            console.error("Error downloading logo:", logoFetchError);
          }
            
          if (logoData) {
            console.log("Logo downloaded successfully, converting to base64");
            const reader = new FileReader();
            logoImageData = await new Promise((resolve) => {
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(logoData);
            });
            console.log("Logo converted to base64 successfully");
          }
        } catch (e) {
          console.error("Error processing logo:", e);
          // Continue without logo
        }
      } else {
        console.log("No logo found for this industry");
      }
    } catch (error) {
      console.error("Error fetching logo info:", error);
      // Continue without logo
    }

    // Generate the PDF
    console.log("Generating PDF document");
    try {
      const pdfBytes = await generatePreApplicationPDF(industry, leadData, logoImageData);
      console.log("PDF generation successful, size:", pdfBytes.byteLength);
      
      // Convert the PDF to a base64 string
      const pdfBase64 = btoa(
        new Uint8Array(pdfBytes)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      console.log("PDF base64 conversion complete, length:", pdfBase64.length);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          pdfBase64
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      throw new Error(`Error generating PDF: ${pdfError.message}`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        stack: error.stack
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

async function generatePreApplicationPDF(industry, leadData, logoImageData) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;
  
  // Add company logo if available
  if (logoImageData) {
    try {
      doc.addImage(logoImageData, 'AUTO', 10, 10, 50, 20);
      yPosition = 40;
      console.log("Logo added to PDF");
    } catch (e) {
      console.error("Error adding logo to PDF:", e);
      // Continue without logo
    }
  }

  // Add document header
  doc.setFontSize(22);
  doc.setTextColor(0, 71, 171); // Blue color
  doc.text('Merchant Pre-Application Form', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Add industry name
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100); // Gray color
  doc.text(`Industry: ${industry.name}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Add generated date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Gray color
  const date = new Date().toLocaleDateString();
  doc.text(`Generated: ${date}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Add divider
  doc.setDrawColor(220, 220, 220);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;

  // Set text color to black for the rest of the document
  doc.setTextColor(0, 0, 0);
  
  // Add a note about non-mandatory fields
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Gray color
  doc.text('Note: All fields in this form are optional. Complete only what applies to you.', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // If lead data is provided, pre-fill it
  if (leadData) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pre-filled Business Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Add form fields
    const fields = [
      { label: 'Business Name:', value: leadData.businessName || 'N/A' },
      { label: 'Email Address:', value: leadData.email || 'N/A' },
      { label: 'Phone Number:', value: leadData.phone || 'N/A' },
      { label: 'Website:', value: leadData.website || 'N/A' },
      { label: 'Monthly Processing Volume:', value: leadData.processingVolume || 'N/A' }
    ];
    
    fields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${field.label}`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(`${field.value}`, 70, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
  }

  // Create comprehensive pre-application form sections
  const sections = [
    {
      title: '1. Business Structure',
      fields: [
        'Sole Proprietorship □  Corporation □  LLC □  Non-profit (401(c)) □',
        'Government □  Other: ___________'
      ]
    },
    {
      title: '2. Business Information',
      fields: [
        'Street (Location) Address: _______________________________________',
        'Mailing (Legal) Address: _______________________________________',
        'Business/Contact Telephone: _______________________',
        'Business/Contact Email: _______________________',
        'Business Fax #: _______________________',
        'Customer Service Telephone: _______________________',
        'Customer Service Email: _______________________',
        'Website/URL: http://______________________________________'
      ]
    },
    {
      title: '3. Authorized Contact',
      fields: [
        'Full Name: _______________________________________'
      ]
    },
    {
      title: '4. Equipment / Software',
      fields: [
        'Terminal/Gateway Used: _______________________',
        'Shopping Cart (if applicable): _______________________'
      ]
    },
    {
      title: '5. Business Location',
      fields: [
        'Number of Employees: _______________________',
        'Location Type: Home/Residential □  Office/Business District □  Storefront □',
        'Own or Rent: Own □  Rent □',
        'Approx. Square Footage: 0–500 ft² □  501–2,000 ft² □  2,001–5,000 ft² □  5,000+ ft² □'
      ]
    }
  ];

  // Add the first page sections
  sections.forEach(section => {
    // Check if we need to add a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    section.fields.forEach(field => {
      doc.text(field, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 6;
  });

  // Add second page with more sections
  doc.addPage();
  yPosition = 20;

  const secondPageSections = [
    {
      title: '6. Principal Information',
      fields: [
        'Full Name: _______________________________________',
        'Ownership %: ___________%',
        'Check here if additional owners/members have 25%+ equity □',
        'Title (Owner, CEO, etc.): _______________________',
        'Home Telephone: _______________________',
        'Date of Birth: ____ / ____ / ______',
        'SSN: _______________________',
        'Driver\'s License #: _______________________',
        'Exp Date: ____ / ____ / ______',
        'State: ___________',
        'Home Address: _______________________________________',
        'Personal Email: _______________________'
      ]
    },
    {
      title: '7. Bank Settlement Information',
      fields: [
        'Bank Name: _______________________',
        'Contact Name at Bank: _______________________',
        'Routing Number: _______________________',
        'Account Number: _______________________'
      ]
    },
    {
      title: '8. Business Description',
      fields: [
        'Products/Services Sold: _______________________________________',
        'Years in Operation: _______________________',
        'Storage Location (if applicable): _______________________'
      ]
    },
    {
      title: '9. Processing Volume',
      fields: [
        'Estimated Total Monthly Volume (All payment types): $__________',
        'Visa/Mastercard Volume: $__________',
        'American Express Volume: $__________',
        'Average Ticket: $__________',
        'Highest Ticket: $__________'
      ]
    }
  ];

  // Add second page sections
  secondPageSections.forEach(section => {
    // Check if we need to add a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    section.fields.forEach(field => {
      doc.text(field, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 6;
  });

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add footer text
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This pre-application form is for informational purposes only. All fields are optional.', 20, 280);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, 280, { align: 'right' });
  }
  
  return doc.output('arraybuffer');
}
