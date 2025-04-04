
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const GOOGLE_CLOUD_PROJECT_ID = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID") || "";
const GOOGLE_CLOUD_LOCATION = Deno.env.get("GOOGLE_CLOUD_LOCATION") || "us";
const GOOGLE_CLOUD_PROCESSOR_ID = Deno.env.get("GOOGLE_CLOUD_PROCESSOR_ID") || "";
const GOOGLE_CLOUD_API_KEY = Deno.env.get("GOOGLE_CLOUD_API_KEY") || "";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Edge function called with method:", req.method);
  
  try {
    // Parse the request body
    const { fileUrl, fileName, fileType } = await req.json();
    
    if (!fileUrl) {
      console.error("Missing file URL in request");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing file URL' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Processing file: ${fileName}, Type: ${fileType}, URL available: ${Boolean(fileUrl)}`);

    // Download the file from the signed URL
    console.log("Attempting to download file from signed URL");
    const fileResponse = await fetch(fileUrl);
    
    if (!fileResponse.ok) {
      console.error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to download file: ${fileResponse.status} ${fileResponse.statusText}` 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get the file content
    const fileContent = await fileResponse.arrayBuffer();
    console.log(`File downloaded successfully, size: ${fileContent.byteLength} bytes`);
    
    // Extract text based on file type
    let extractedText = "";
    
    if (fileType.includes("pdf")) {
      if (GOOGLE_CLOUD_API_KEY && GOOGLE_CLOUD_PROJECT_ID && GOOGLE_CLOUD_PROCESSOR_ID) {
        try {
          console.log("Attempting Document AI extraction");
          extractedText = await extractTextWithDocumentAI(fileContent, fileType);
          console.log("Document AI extraction successful");
        } catch (error) {
          console.error("Document AI extraction failed:", error);
          return new Response(
            JSON.stringify({
              success: false, 
              error: `PDF processing error: ${error instanceof Error ? error.message : String(error)}.`,
              message: "The system is currently unable to process PDF files. Please try uploading a CSV or Excel file instead."
            }),
            { status: 422, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
      } else {
        console.error("Document AI credentials not configured");
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Document AI credentials not configured',
            message: "The system is currently unable to process PDF files. Please try uploading a CSV or Excel file instead, or contact support to enable PDF processing."
          }),
          { status: 422, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    } 
    else if (fileType.includes("csv") || fileType.includes("excel") || fileType.includes("sheet")) {
      console.log("Processing spreadsheet file");
      const text = new TextDecoder().decode(fileContent);
      extractedText = text;
      if (!text || text.trim().length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to extract text from spreadsheet' 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      console.log("Extracted text from spreadsheet, length:", extractedText.length);
    } 
    else {
      console.error("Unsupported file format:", fileType);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unsupported file format. Please upload a PDF, CSV, or Excel file.' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      console.error("Failed to extract text from document");
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to extract text from document' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    console.log("Text extraction successful, length:", extractedText.length);
    console.log("Sample text:", extractedText.substring(0, 200) + "...");
    
    // Now analyze with OpenAI
    let analysisResult;
    
    if (OPENAI_API_KEY) {
      try {
        console.log("Analyzing with OpenAI");
        analysisResult = await analyzeWithOpenAI(extractedText);
        console.log("OpenAI analysis successful", analysisResult);
      } catch (error) {
        console.error("OpenAI analysis failed:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: `OpenAI analysis failed: ${error instanceof Error ? error.message : String(error)}` 
          }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    } else {
      console.error("Missing OpenAI API key");
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key is required for statement analysis" 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Return the results with explicit isMockData = false for real data
    return new Response(
      JSON.stringify({ 
        success: true,
        ...analysisResult,
        isMockData: false // Explicitly set to false for real data
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

/**
 * Extract text from document using Google Document AI
 */
async function extractTextWithDocumentAI(fileContent: ArrayBuffer, fileType: string) {
  if (!GOOGLE_CLOUD_API_KEY || !GOOGLE_CLOUD_PROJECT_ID || !GOOGLE_CLOUD_PROCESSOR_ID) {
    throw new Error('Missing Google Cloud credentials');
  }

  const apiEndpoint = `https://${GOOGLE_CLOUD_LOCATION}-documentai.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/${GOOGLE_CLOUD_LOCATION}/processors/${GOOGLE_CLOUD_PROCESSOR_ID}:process`;
  
  const mimeType = fileType || "application/pdf";
  const encodedContent = btoa(String.fromCharCode(...new Uint8Array(fileContent)));
  
  const requestBody = {
    rawDocument: {
      content: encodedContent,
      mimeType: mimeType
    }
  };
  
  const response = await fetch(`${apiEndpoint}?key=${GOOGLE_CLOUD_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Document AI API error: ${response.status} ${errorText}`);
  }
  
  const result = await response.json();
  return result.document.text;
}

/**
 * Analyze text with OpenAI
 */
async function analyzeWithOpenAI(extractedText: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key');
  }

  console.log("Sending text to OpenAI for analysis");
  const openaiUrl = 'https://api.openai.com/v1/chat/completions';
  
  const response = await fetch(openaiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst specialized in merchant processing statements. Extract the requested information precisely from the statement text. You MUST ONLY extract actual numbers from the statement. If you cannot find a specific piece of information, use 'N/A' as the value. Never generate data that doesn't exist in the statement."
        },
        {
          role: "user",
          content: `Extract the following information from this merchant statement: 
          
          1. Calculate the effective rate: this is the total fees divided by total volume. If you cannot find the total volume, look for total sales or total processed amount.
          2. Monthly processing volume: Look for the total sales or processed amount for the month. Do not make up a value if not found.
          3. Chargeback ratio: Look for number of chargebacks divided by total transactions, or similar metric.
          4. Pricing model: Look for terms like "interchange-plus" or "tiered" or "flat rate".
          5. List all monthly fees found in the statement (monthly fee, PCI fee, statement fee, batch fee, transaction fees, etc.)
          
          DO NOT INVENT VALUES. If you cannot find data for any field, use "N/A" instead of making up a value.
          
          Format your response as a JSON object with these exact fields:
          {
            "effectiveRate": "X.XX%" or "N/A",
            "monthlyVolume": "$XXX,XXX.XX" or "N/A",
            "chargebackRatio": "0.XX%" or "N/A",
            "pricingModel": "Type found in statement" or "N/A",
            "fees": {
              "monthlyFee": "$XX.XX" or "N/A",
              "pciFee": "$XX.XX" or "N/A",
              "statementFee": "$X.XX" or "N/A",
              "batchFee": "$X.XX" or "N/A",
              "transactionFees": "description" or "N/A"
            }
          }
          
          Here's the statement text to analyze:
          
          ${extractedText}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Lower temperature for more accurate extraction
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API error response:", errorText);
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log("OpenAI response received"); 
  
  try {
    const analysisJSON = JSON.parse(result.choices[0].message.content);
    console.log("Parsed analysis result:", analysisJSON);
    
    // Ensure all fields are present, use "N/A" for anything missing
    return {
      effectiveRate: analysisJSON.effectiveRate || "N/A",
      monthlyVolume: analysisJSON.monthlyVolume || "N/A",
      chargebackRatio: analysisJSON.chargebackRatio || "N/A",
      pricingModel: analysisJSON.pricingModel || "N/A",
      fees: {
        monthlyFee: analysisJSON.fees?.monthlyFee || "N/A",
        pciFee: analysisJSON.fees?.pciFee || "N/A",
        statementFee: analysisJSON.fees?.statementFee || "N/A",
        batchFee: analysisJSON.fees?.batchFee || "N/A",
        transactionFees: analysisJSON.fees?.transactionFees || "N/A"
      }
    };
  } catch (error) {
    console.error("Error parsing OpenAI response:", error, "Raw response:", result.choices[0].message.content);
    throw new Error("Failed to parse OpenAI response");
  }
}
