
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Base64 encoded Waveline logo
const wavelineLogo = "data:image/png;base64,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";

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
    
    const { industryId, leadData, formData } = requestBody;
    
    console.log("Generating PDF for industry:", industryId);
    console.log("Lead data:", leadData || "No lead data provided");
    console.log("Form data:", formData ? "Form data provided" : "No form data provided");

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
        console.log("No logo found for this industry, using default Waveline logo");
        logoImageData = wavelineLogo;
      }
    } catch (error) {
      console.error("Error fetching logo info:", error);
      // Continue without industry logo, use Waveline logo
      logoImageData = wavelineLogo;
    }

    // Generate the PDF
    console.log("Generating PDF document");
    try {
      const pdfBytes = await generatePreApplicationPDF(industry, leadData, formData, logoImageData);
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

async function generatePreApplicationPDF(industry, leadData, formData, logoImageData) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;
  
  // Add company logo
  if (logoImageData) {
    try {
      doc.addImage(logoImageData, 'AUTO', 10, 10, 50, 20);
      yPosition = 40;
      console.log("Logo added to PDF");
    } catch (e) {
      console.error("Error adding logo to PDF:", e);
      yPosition = 20;
      // Continue without logo
    }
  }

  // Add document header
  doc.setFontSize(22);
  doc.setTextColor(0, 71, 171); // Blue color
  doc.text('WaveLine Merchant Application', pageWidth / 2, yPosition, { align: 'center' });
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

  // Function to add a field with a checkbox
  const addCheckboxField = (name, value, x, y) => {
    doc.rect(x, y - 3, 4, 4); // Checkbox
    if (value) {
      doc.setFillColor(0, 0, 0);
      doc.rect(x + 0.5, y - 2.5, 3, 3, 'F');
    }
    doc.text(name, x + 6, y);
    return y;
  };

  // Function to add a checkbox group (horizontally aligned)
  const addCheckboxGroup = (options, values, x, y) => {
    let currentX = x;
    
    options.forEach((option, index) => {
      doc.rect(currentX, y - 3, 4, 4); // Checkbox
      
      if (values && values.includes(option.value)) {
        doc.setFillColor(0, 0, 0);
        doc.rect(currentX + 0.5, y - 2.5, 3, 3, 'F');
      }
      
      doc.text(option.label, currentX + 6, y);
      currentX += option.label.length * 2 + 20; // Adjust spacing based on text length
    });
    
    return y;
  };

  // Function to add label and value
  const addField = (label, value, x, y) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, y);
    
    doc.setFont('helvetica', 'normal');
    if (value) {
      doc.text(value, x + label.length * 2, y);
    } else {
      doc.setDrawColor(0, 0, 0);
      doc.line(x + label.length * 2, y, x + 100, y);
    }
    
    return y;
  };

  // Function to add a section header
  const addSectionHeader = (number, title, y) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${number}. ${title}`, 20, y);
    doc.setFont('helvetica', 'normal');
    return y + 7;
  };

  // Function to check if we need a new page
  const checkNewPage = (y) => {
    if (y > 265) {
      doc.addPage();
      return 25;
    }
    return y;
  };

  // SECTION 1: Business Structure
  yPosition = addSectionHeader('1', 'Business Structure', yPosition);
  
  const businessStructureOptions = [
    { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
    { label: 'Corporation', value: 'corporation' },
    { label: 'LLC', value: 'llc' },
    { label: 'Non-profit (401(c))', value: 'non_profit' },
    { label: 'Government', value: 'government' },
    { label: 'Other', value: 'other' }
  ];
  
  if (formData) {
    yPosition = addCheckboxGroup(
      businessStructureOptions,
      [formData.businessStructure],
      20,
      yPosition
    );
    
    if (formData.businessStructure === 'other' && formData.businessStructureOther) {
      doc.text(`: ${formData.businessStructureOther}`, 120, yPosition);
    }
  } else {
    // Empty checkboxes
    yPosition = addCheckboxGroup(businessStructureOptions, [], 20, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 2: Business Information
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('2', 'Business Information', yPosition);
  
  // Business fields
  if (formData) {
    yPosition = addField('Street (Location) Address:', formData.streetAddress, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Mailing (Legal) Address:', formData.mailingAddress, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business/Contact Telephone:', formData.businessPhone, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business/Contact Email:', formData.businessEmail, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business Fax #:', formData.businessFax, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Customer Service Telephone:', formData.customerServicePhone, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Customer Service Email:', formData.customerServiceEmail, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Website/URL:', formData.website ? `http://${formData.website.replace('http://', '').replace('https://', '')}` : '', 20, yPosition);
  } else if (leadData) {
    yPosition = addField('Street (Location) Address:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Mailing (Legal) Address:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business/Contact Telephone:', leadData.phone, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business/Contact Email:', leadData.email, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business Fax #:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Customer Service Telephone:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Customer Service Email:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Website/URL:', leadData.website ? `http://${leadData.website.replace('http://', '').replace('https://', '')}` : '', 20, yPosition);
  } else {
    yPosition = addField('Street (Location) Address:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Mailing (Legal) Address:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business/Contact Telephone:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business/Contact Email:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Business Fax #:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Customer Service Telephone:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Customer Service Email:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Website/URL:', '', 20, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 3: Authorized Contact
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('3', 'Authorized Contact', yPosition);
  
  if (formData) {
    yPosition = addField('Full Name:', formData.authorizedContactName, 20, yPosition);
  } else if (leadData) {
    yPosition = addField('Full Name:', leadData.businessName, 20, yPosition);
  } else {
    yPosition = addField('Full Name:', '', 20, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 4: Equipment / Software
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('4', 'Equipment / Software', yPosition);
  
  if (formData) {
    yPosition = addField('Terminal/Gateway Used:', formData.terminalGateway, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Shopping Cart (if applicable):', formData.shoppingCart, 20, yPosition);
  } else {
    yPosition = addField('Terminal/Gateway Used:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Shopping Cart (if applicable):', '', 20, yPosition);
  }
  
  yPosition += 3;
  doc.setFontSize(9);
  doc.text('If using Shopify, request Authorize.net Gateway.', 20, yPosition);
  doc.setFontSize(11);
  
  yPosition += 10;
  
  // SECTION 5: Business Location
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('5', 'Business Location', yPosition);
  
  if (formData) {
    yPosition = addField('Number of Employees:', formData.employeeCount, 20, yPosition);
    yPosition += 10;
    
    // Location Type
    doc.text('Location Type:', 20, yPosition);
    yPosition = addCheckboxGroup(
      [
        { label: 'Home/Residential', value: 'home' },
        { label: 'Office/Business District', value: 'office' },
        { label: 'Storefront', value: 'storefront' }
      ],
      [formData.locationType],
      60,
      yPosition
    );
    yPosition += 10;
    
    // Own or Rent
    doc.text('Own or Rent:', 20, yPosition);
    yPosition = addCheckboxGroup(
      [
        { label: 'Own', value: 'own' },
        { label: 'Rent', value: 'rent' }
      ],
      [formData.ownOrRent],
      60,
      yPosition
    );
    yPosition += 10;
    
    // Square Footage
    doc.text('Approx. Square Footage:', 20, yPosition);
    yPosition = addCheckboxGroup(
      [
        { label: '0–500 ft²', value: '0-500' },
        { label: '501–2,000 ft²', value: '501-2000' },
        { label: '2,001–5,000 ft²', value: '2001-5000' },
        { label: '5,000+ ft²', value: '5000+' }
      ],
      [formData.squareFootage],
      60,
      yPosition
    );
  } else {
    yPosition = addField('Number of Employees:', '', 20, yPosition);
    yPosition += 10;
    
    // Location Type
    doc.text('Location Type:', 20, yPosition);
    yPosition = addCheckboxGroup(
      [
        { label: 'Home/Residential', value: 'home' },
        { label: 'Office/Business District', value: 'office' },
        { label: 'Storefront', value: 'storefront' }
      ],
      [],
      60,
      yPosition
    );
    yPosition += 10;
    
    // Own or Rent
    doc.text('Own or Rent:', 20, yPosition);
    yPosition = addCheckboxGroup(
      [
        { label: 'Own', value: 'own' },
        { label: 'Rent', value: 'rent' }
      ],
      [],
      60,
      yPosition
    );
    yPosition += 10;
    
    // Square Footage
    doc.text('Approx. Square Footage:', 20, yPosition);
    yPosition = addCheckboxGroup(
      [
        { label: '0–500 ft²', value: '0-500' },
        { label: '501–2,000 ft²', value: '501-2000' },
        { label: '2,001–5,000 ft²', value: '2001-5000' },
        { label: '5,000+ ft²', value: '5000+' }
      ],
      [],
      60,
      yPosition
    );
  }
  
  yPosition += 10;

  // Add second page
  doc.addPage();
  yPosition = 25;
  
  // Add company logo to second page
  if (logoImageData) {
    try {
      doc.addImage(logoImageData, 'AUTO', pageWidth - 60, 10, 50, 20);
    } catch (e) {
      console.error("Error adding logo to second page:", e);
      // Continue without logo
    }
  }
  
  // SECTION 6: Principal Information
  yPosition = addSectionHeader('6', 'Principal Information', yPosition);
  
  if (formData) {
    yPosition = addField('Full Name:', formData.principalName, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Ownership %:', formData.ownershipPercentage, 20, yPosition);
    
    // Additional owners checkbox
    yPosition = addCheckboxField(
      'Check here if additional owners/members have 25%+ equity',
      formData.additionalOwners,
      120,
      yPosition
    );
    yPosition += 7;
    
    yPosition = addField('Title (Owner, CEO, etc.):', formData.principalTitle, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Home Telephone:', formData.principalPhone, 20, yPosition);
    yPosition += 7;
    
    // Date of Birth
    const dob = formData.dateOfBirthMonth && formData.dateOfBirthDay && formData.dateOfBirthYear
      ? `${formData.dateOfBirthMonth} / ${formData.dateOfBirthDay} / ${formData.dateOfBirthYear}`
      : '';
    yPosition = addField('Date of Birth:', dob, 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('SSN:', formData.ssn, 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('Driver\'s License #:', formData.driversLicense, 20, yPosition);
    
    // License expiration
    const licExp = formData.licenseExpMonth && formData.licenseExpDay && formData.licenseExpYear
      ? `${formData.licenseExpMonth} / ${formData.licenseExpDay} / ${formData.licenseExpYear}`
      : '';
    yPosition = addField('Exp Date:', licExp, 100, yPosition);
    
    yPosition = addField('State:', formData.licenseState, 150, yPosition);
    yPosition += 7;
    
    yPosition = addField('Home Address:', formData.principalAddress, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Personal Email:', formData.principalEmail, 20, yPosition);
  } else {
    yPosition = addField('Full Name:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Ownership %:', '', 20, yPosition);
    
    // Additional owners checkbox
    yPosition = addCheckboxField(
      'Check here if additional owners/members have 25%+ equity',
      false,
      120,
      yPosition
    );
    yPosition += 7;
    
    yPosition = addField('Title (Owner, CEO, etc.):', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Home Telephone:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Date of Birth:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('SSN:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Driver\'s License #:', '', 20, yPosition);
    yPosition = addField('Exp Date:', '', 100, yPosition);
    yPosition = addField('State:', '', 150, yPosition);
    yPosition += 7;
    yPosition = addField('Home Address:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Personal Email:', '', 20, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 7: Bank Settlement Information
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('7', 'Bank Settlement Information', yPosition);
  
  if (formData) {
    yPosition = addField('Bank Name:', formData.bankName, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Contact Name at Bank:', formData.bankContactName, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Routing Number:', formData.routingNumber, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Account Number:', formData.accountNumber, 20, yPosition);
  } else {
    yPosition = addField('Bank Name:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Contact Name at Bank:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Routing Number:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Account Number:', '', 20, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 8: Business Description
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('8', 'Business Description', yPosition);
  
  if (formData) {
    yPosition = addField('Products/Services Sold:', formData.productsServices, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Years in Operation:', formData.yearsInOperation, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Storage Location (if applicable):', formData.storageLocation, 20, yPosition);
  } else {
    yPosition = addField('Products/Services Sold:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Years in Operation:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Storage Location (if applicable):', '', 20, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 9: Processing Volume
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('9', 'Processing Volume', yPosition);
  
  if (formData) {
    yPosition = addField('Estimated Total Monthly Volume:', `$${formData.totalMonthlyVolume || leadData?.processingVolume || ''}`, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Visa/Mastercard Volume:', `$${formData.visaMastercardVolume || ''}`, 20, yPosition);
    yPosition += 7;
    yPosition = addField('American Express Volume:', `$${formData.amexVolume || ''}`, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Average Ticket:', `$${formData.averageTicket || ''}`, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Highest Ticket:', `$${formData.highestTicket || ''}`, 20, yPosition);
  } else if (leadData?.processingVolume) {
    yPosition = addField('Estimated Total Monthly Volume:', `$${leadData.processingVolume}`, 20, yPosition);
    yPosition += 7;
    yPosition = addField('Visa/Mastercard Volume:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('American Express Volume:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Average Ticket:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Highest Ticket:', '', 20, yPosition);
  } else {
    yPosition = addField('Estimated Total Monthly Volume:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Visa/Mastercard Volume:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('American Express Volume:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Average Ticket:', '', 20, yPosition);
    yPosition += 7;
    yPosition = addField('Highest Ticket:', '', 20, yPosition);
  }
  
  yPosition += 10;

  // Add third page
  doc.addPage();
  yPosition = 25;
  
  // Add company logo to third page
  if (logoImageData) {
    try {
      doc.addImage(logoImageData, 'AUTO', pageWidth - 60, 10, 50, 20);
    } catch (e) {
      console.error("Error adding logo to third page:", e);
      // Continue without logo
    }
  }
  
  // SECTION 10: Transaction Method
  yPosition = addSectionHeader('10', 'Transaction Method (Must Equal 100%)', yPosition);
  
  if (formData) {
    yPosition = addCheckboxField('Face-to-Face (Retail):', false, 20, yPosition);
    doc.text(`${formData.faceToFacePercentage || ''}%`, 100, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Telephone/Mail/Email (MOTO):', false, 20, yPosition);
    doc.text(`${formData.motoPercentage || ''}%`, 100, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Internet (eCommerce):', false, 20, yPosition);
    doc.text(`${formData.ecommercePercentage || ''}%`, 100, yPosition);
  } else {
    yPosition = addCheckboxField('Face-to-Face (Retail):', false, 20, yPosition);
    doc.text('______%', 100, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Telephone/Mail/Email (MOTO):', false, 20, yPosition);
    doc.text('______%', 100, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Internet (eCommerce):', false, 20, yPosition);
    doc.text('______%', 100, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 11: Refund / Cancellation Policy
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('11', 'Refund / Cancellation Policy', yPosition);
  
  if (formData) {
    yPosition = addCheckboxField('Do you have a refund policy?', formData.hasRefundPolicy, 20, yPosition);
    yPosition = addCheckboxField('Yes', formData.hasRefundPolicy, 145, yPosition);
    yPosition = addCheckboxField('No', !formData.hasRefundPolicy, 165, yPosition);
    yPosition += 10;
    
    doc.text('Policy Type:', 20, yPosition);
    yPosition = addCheckboxField('Exchange', formData.policyType === 'exchange', 65, yPosition);
    yPosition = addCheckboxField('Store Credit', formData.policyType === 'store_credit', 110, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Refund within 30 days', formData.policyType === 'refund_30_days', 65, yPosition);
    yPosition = addCheckboxField('Other', formData.policyType === 'other', 150, yPosition);
    
    if (formData.policyType === 'other' && formData.policyTypeOther) {
      doc.text(`: ${formData.policyTypeOther}`, 170, yPosition);
    }
    yPosition += 10;
    
    yPosition = addCheckboxField('Processing History?', formData.hasProcessingHistory, 20, yPosition);
    yPosition = addCheckboxField('Yes', formData.hasProcessingHistory, 120, yPosition);
    yPosition = addCheckboxField('No', !formData.hasProcessingHistory, 140, yPosition);
    yPosition += 7;
    
    doc.text('If yes, attach 3 most recent processing statements.', 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('Current/Previous Processor(s):', formData.currentPreviousProcessors, 20, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Previous Terminations?', formData.hasPreviousTerminations, 20, yPosition);
    yPosition = addCheckboxField('Yes*', formData.hasPreviousTerminations, 120, yPosition);
    yPosition = addCheckboxField('No', !formData.hasPreviousTerminations, 140, yPosition);
    
    if (formData.hasPreviousTerminations) {
      doc.text(`If Yes, explain: ${formData.terminationsExplanation || ''}`, 170, yPosition);
    } else {
      doc.text('If Yes, explain: ________________________', 170, yPosition);
    }
    yPosition += 7;
    
    yPosition = addCheckboxField('Bankruptcies?', formData.hasBankruptcies, 20, yPosition);
    yPosition = addCheckboxField('Yes*', formData.hasBankruptcies, 120, yPosition);
    yPosition = addCheckboxField('No', !formData.hasBankruptcies, 140, yPosition);
    
    if (formData.hasBankruptcies) {
      doc.text(`If Yes, explain: ${formData.bankruptciesExplanation || ''}`, 170, yPosition);
    } else {
      doc.text('If Yes, explain: ________________________', 170, yPosition);
    }
  } else {
    yPosition = addCheckboxField('Do you have a refund policy?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes', false, 145, yPosition);
    yPosition = addCheckboxField('No', false, 165, yPosition);
    yPosition += 10;
    
    doc.text('Policy Type:', 20, yPosition);
    yPosition = addCheckboxField('Exchange', false, 65, yPosition);
    yPosition = addCheckboxField('Store Credit', false, 110, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Refund within 30 days', false, 65, yPosition);
    yPosition = addCheckboxField('Other', false, 150, yPosition);
    doc.text(': _____________________', 170, yPosition);
    yPosition += 10;
    
    yPosition = addCheckboxField('Processing History?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes', false, 120, yPosition);
    yPosition = addCheckboxField('No', false, 140, yPosition);
    yPosition += 7;
    
    doc.text('If yes, attach 3 most recent processing statements.', 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('Current/Previous Processor(s):', '', 20, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Previous Terminations?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes*', false, 120, yPosition);
    yPosition = addCheckboxField('No', false, 140, yPosition);
    doc.text('If Yes, explain: ________________________', 170, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Bankruptcies?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes*', false, 120, yPosition);
    yPosition = addCheckboxField('No', false, 140, yPosition);
    doc.text('If Yes, explain: ________________________', 170, yPosition);
  }
  
  yPosition += 10;
  
  // SECTION 12: Business Type
  yPosition = checkNewPage(yPosition);
  yPosition = addSectionHeader('12', 'Business Type', yPosition);
  
  if (formData) {
    yPosition = addField('B2B (%):', formData.b2bPercentage, 20, yPosition);
    yPosition = addField('B2C (%):', formData.b2cPercentage, 100, yPosition);
    yPosition += 10;
    
    yPosition = addCheckboxField('Seasonal Business?', formData.isSeasonalBusiness, 20, yPosition);
    yPosition = addCheckboxField('Yes', formData.isSeasonalBusiness, 120, yPosition);
    yPosition = addCheckboxField('No', !formData.isSeasonalBusiness, 140, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Recurring Payments/Subscriptions?', formData.hasRecurringPayments, 20, yPosition);
    yPosition = addCheckboxField('Yes', formData.hasRecurringPayments, 120, yPosition);
    yPosition = addCheckboxField('No', !formData.hasRecurringPayments, 140, yPosition);
    
    if (formData.hasRecurringPayments) {
      yPosition += 7;
      doc.text(`If yes, specify: ${formData.recurringPaymentsDetails || ''}`, 20, yPosition);
    } else {
      yPosition += 7;
      doc.text('If yes, specify: ______________________________________', 20, yPosition);
    }
  } else {
    yPosition = addField('B2B (%):', '', 20, yPosition);
    yPosition = addField('B2C (%):', '', 100, yPosition);
    yPosition += 10;
    
    yPosition = addCheckboxField('Seasonal Business?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes', false, 120, yPosition);
    yPosition = addCheckboxField('No', false, 140, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Recurring Payments/Subscriptions?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes', false, 120, yPosition);
    yPosition = addCheckboxField('No', false, 140, yPosition);
    yPosition += 7;
    doc.text('If yes, specify: ______________________________________', 20, yPosition);
  }
  
  yPosition += 10;

  // Add fourth page
  doc.addPage();
  yPosition = 25;
  
  // Add company logo to fourth page
  if (logoImageData) {
    try {
      doc.addImage(logoImageData, 'AUTO', pageWidth - 60, 10, 50, 20);
    } catch (e) {
      console.error("Error adding logo to fourth page:", e);
      // Continue without logo
    }
  }
  
  // SECTION 13: eCommerce / Card-Not-Present
  yPosition = addSectionHeader('13', 'eCommerce / Card-Not-Present', yPosition);
  
  if (formData) {
    yPosition = addField('Product Purchase Address(es):', formData.productPurchaseAddresses, 20, yPosition);
    yPosition += 10;
    
    doc.text('Who Owns Inventory?', 20, yPosition);
    yPosition = addCheckboxField('Merchant', formData.inventoryOwnership === 'merchant', 110, yPosition);
    yPosition = addCheckboxField('Vendor (Drop Ship)', formData.inventoryOwnership === 'vendor', 150, yPosition);
    yPosition += 7;
    
    yPosition = addField('Fulfillment Provider(s):', formData.fulfillmentProviders, 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('Shopping Cart / CRM Platform(s):', formData.shoppingCartPlatforms, 20, yPosition);
    yPosition += 10;
    
    doc.text('How Do Customers Purchase?', 20, yPosition);
    yPosition = addCheckboxField('In Person', formData.purchaseMethods.includes('in_person'), 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Mail/Phone', formData.purchaseMethods.includes('mail_phone'), 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Internet', formData.purchaseMethods.includes('internet'), 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Fax', formData.purchaseMethods.includes('fax'), 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Other', formData.purchaseMethods.includes('other'), 120, yPosition);
    
    if (formData.purchaseMethods.includes('other') && formData.purchaseMethodsOther) {
      doc.text(`: ${formData.purchaseMethodsOther}`, 140, yPosition);
    }
    yPosition += 7;
    
    yPosition = addField('Call Center Provider(s):', formData.callCenterProviders, 20, yPosition);
    yPosition += 10;
    
    doc.text('Authorization to Shipment Timeframe:', 20, yPosition);
    yPosition = addCheckboxField('0–7 days', formData.authToShipTimeframe === '0-7', 100, yPosition);
    yPosition = addCheckboxField('8–14 days', formData.authToShipTimeframe === '8-14', 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('15–30 days', formData.authToShipTimeframe === '15-30', 100, yPosition);
    yPosition = addCheckboxField('30–90 days', formData.authToShipTimeframe === '30-90', 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('90+ days', formData.authToShipTimeframe === '90+', 100, yPosition);
    yPosition += 10;
    
    doc.text('Delivery Timeframe to Customer:', 20, yPosition);
    yPosition = addCheckboxField('0–7 days', formData.deliveryTimeframe === '0-7', 100, yPosition);
    yPosition = addCheckboxField('8–14 days', formData.deliveryTimeframe === '8-14', 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('15–30 days', formData.deliveryTimeframe === '15-30', 100, yPosition);
    yPosition = addCheckboxField('30–90 days', formData.deliveryTimeframe === '30-90', 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('90+ days', formData.deliveryTimeframe === '90+', 100, yPosition);
    yPosition += 10;
    
    yPosition = addField('Chargeback Management System (if any):', formData.chargebackManagement, 20, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Deposits Required?', formData.depositsRequired, 20, yPosition);
    yPosition = addCheckboxField('Yes', formData.depositsRequired, 110, yPosition);
    yPosition = addCheckboxField('No', !formData.depositsRequired, 130, yPosition);
    
    if (formData.depositsRequired) {
      doc.text(`If Yes, % Required: ${formData.depositPercentage || ''}%`, 160, yPosition);
    } else {
      doc.text('If Yes, % Required: __________%', 160, yPosition);
    }
    yPosition += 10;
    
    doc.text('When is Full Payment Received?', 20, yPosition);
    yPosition = addCheckboxField('100% Paid in Advance', formData.fullPaymentTiming === 'advance', 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('100% Paid on Delivery/Completion', formData.fullPaymentTiming === 'delivery', 120, yPosition);
    yPosition += 10;
    
    yPosition = addField('Sales Regions:', formData.salesRegions, 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('% of International Transactions:', `${formData.internationalTransactionsPercentage || ''}%`, 20, yPosition);
    yPosition += 10;
    
    doc.text('Shipping Method:', 20, yPosition);
    yPosition = addCheckboxField('FedEx', formData.shippingMethod.includes('fedex'), 80, yPosition);
    yPosition = addCheckboxField('UPS', formData.shippingMethod.includes('ups'), 120, yPosition);
    yPosition = addCheckboxField('USPS', formData.shippingMethod.includes('usps'), 150, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Other', formData.shippingMethod.includes('other'), 80, yPosition);
    
    if (formData.shippingMethod.includes('other') && formData.shippingMethodOther) {
      doc.text(`: ${formData.shippingMethodOther}`, 100, yPosition);
    }
    yPosition += 10;
    
    doc.text('Advertising Channels:', 20, yPosition);
    yPosition = addCheckboxField('Catalog', formData.advertisingChannels.includes('catalog'), 80, yPosition);
    yPosition = addCheckboxField('TV/Radio', formData.advertisingChannels.includes('tv_radio'), 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Flyers/Direct Mail', formData.advertisingChannels.includes('flyers'), 80, yPosition);
    yPosition = addCheckboxField('Internet', formData.advertisingChannels.includes('internet'), 150, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Other', formData.advertisingChannels.includes('other'), 80, yPosition);
    
    if (formData.advertisingChannels.includes('other') && formData.advertisingChannelsOther) {
      doc.text(`: ${formData.advertisingChannelsOther}`, 100, yPosition);
    }
    yPosition += 10;
    
    doc.text('Warranty / Guarantee Provided By:', 20, yPosition);
    yPosition = addCheckboxField('Merchant', formData.warrantyProvider === 'merchant', 120, yPosition);
    yPosition = addCheckboxField('Manufacturer', formData.warrantyProvider === 'manufacturer', 160, yPosition);
  } else {
    yPosition = addField('Product Purchase Address(es):', '', 20, yPosition);
    yPosition += 10;
    
    doc.text('Who Owns Inventory?', 20, yPosition);
    yPosition = addCheckboxField('Merchant', false, 110, yPosition);
    yPosition = addCheckboxField('Vendor (Drop Ship)', false, 150, yPosition);
    yPosition += 7;
    
    yPosition = addField('Fulfillment Provider(s):', '', 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('Shopping Cart / CRM Platform(s):', '', 20, yPosition);
    yPosition += 10;
    
    doc.text('How Do Customers Purchase?', 20, yPosition);
    yPosition = addCheckboxField('In Person', false, 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Mail/Phone', false, 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Internet', false, 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Fax', false, 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Other', false, 120, yPosition);
    doc.text(': ___________', 140, yPosition);
    yPosition += 7;
    
    yPosition = addField('Call Center Provider(s):', '', 20, yPosition);
    yPosition += 10;
    
    doc.text('Authorization to Shipment Timeframe:', 20, yPosition);
    yPosition = addCheckboxField('0–7 days', false, 100, yPosition);
    yPosition = addCheckboxField('8–14 days', false, 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('15–30 days', false, 100, yPosition);
    yPosition = addCheckboxField('30–90 days', false, 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('90+ days', false, 100, yPosition);
    yPosition += 10;
    
    doc.text('Delivery Timeframe to Customer:', 20, yPosition);
    yPosition = addCheckboxField('0–7 days', false, 100, yPosition);
    yPosition = addCheckboxField('8–14 days', false, 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('15–30 days', false, 100, yPosition);
    yPosition = addCheckboxField('30–90 days', false, 140, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('90+ days', false, 100, yPosition);
    yPosition += 10;
    
    yPosition = addField('Chargeback Management System (if any):', '', 20, yPosition);
    yPosition += 7;
    
    yPosition = addCheckboxField('Deposits Required?', false, 20, yPosition);
    yPosition = addCheckboxField('Yes', false, 110, yPosition);
    yPosition = addCheckboxField('No', false, 130, yPosition);
    doc.text('If Yes, % Required: __________%', 160, yPosition);
    yPosition += 10;
    
    doc.text('When is Full Payment Received?', 20, yPosition);
    yPosition = addCheckboxField('100% Paid in Advance', false, 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('100% Paid on Delivery/Completion', false, 120, yPosition);
    yPosition += 10;
    
    yPosition = addField('Sales Regions:', '', 20, yPosition);
    yPosition += 7;
    
    yPosition = addField('% of International Transactions:', '', 20, yPosition);
    yPosition += 10;
    
    doc.text('Shipping Method:', 20, yPosition);
    yPosition = addCheckboxField('FedEx', false, 80, yPosition);
    yPosition = addCheckboxField('UPS', false, 120, yPosition);
    yPosition = addCheckboxField('USPS', false, 150, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Other', false, 80, yPosition);
    doc.text(': ___________', 100, yPosition);
    yPosition += 10;
    
    doc.text('Advertising Channels:', 20, yPosition);
    yPosition = addCheckboxField('Catalog', false, 80, yPosition);
    yPosition = addCheckboxField('TV/Radio', false, 120, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Flyers/Direct Mail', false, 80, yPosition);
    yPosition = addCheckboxField('Internet', false, 150, yPosition);
    yPosition += 7;
    yPosition = addCheckboxField('Other', false, 80, yPosition);
    doc.text(': ___________', 100, yPosition);
    yPosition += 10;
    
    doc.text('Warranty / Guarantee Provided By:', 20, yPosition);
    yPosition = addCheckboxField('Merchant', false, 120, yPosition);
    yPosition = addCheckboxField('Manufacturer', false, 160, yPosition);
  }

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add footer text
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('WaveLine Merchant Services | Merchant Application Form', 20, 280);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, 280, { align: 'right' });
  }
  
  return doc.output('arraybuffer');
}
