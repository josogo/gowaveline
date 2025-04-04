
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get environment variables
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

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
    
    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key not configured");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Gemini API key not configured',
          message: "The system needs a Google Gemini API key to process files. Please add your Gemini API key in Supabase Edge Function Secrets."
        }),
        { status: 422, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Extract and analyze with Gemini
    console.log("Using Gemini API for both extraction and analysis");
    let analysisResult;
    
    try {
      analysisResult = await analyzeWithGemini(fileContent, fileType);
      console.log("Gemini analysis successful", analysisResult);
    } catch (error) {
      console.error("Gemini analysis failed:", error);
      return new Response(
        JSON.stringify({
          success: false, 
          error: `Gemini processing error: ${error instanceof Error ? error.message : String(error)}.`,
          message: "There was an issue processing your file with Gemini API."
        }),
        { status: 422, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
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
 * Analyze file with Google Gemini AI
 * This function handles both PDF extraction and merchant statement analysis
 */
async function analyzeWithGemini(fileContent: ArrayBuffer, fileType: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key');
  }

  // Only use a portion of the file if it's very large
  const maxBytes = 1024 * 1024; // 1MB limit
  const contentToProcess = fileContent.byteLength > maxBytes 
    ? fileContent.slice(0, maxBytes) 
    : fileContent;
  
  console.log(`Processing content with Gemini, size: ${contentToProcess.byteLength} bytes ` + 
    (fileContent.byteLength > maxBytes ? "(truncated due to size)" : ""));
  
  try {
    // Convert file to base64 with proper error handling
    const uint8Array = new Uint8Array(contentToProcess);
    let binary = '';
    const chunkSize = 1024;
    
    // Process in chunks to avoid call stack issues
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      chunk.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
    }
    
    const base64File = btoa(binary);
    console.log(`Converted file to base64, length: ${base64File.length}`);
    
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;
    
    const promptText = `
You are a financial analyst specialized in merchant processing statements. 
Extract and analyze the following information from this merchant statement and present your findings in JSON format:

1. Calculate the effective rate: this is the total fees divided by total volume. If you cannot find the total volume, look for total sales or total processed amount.
2. Monthly processing volume: Look for the total sales or processed amount for the month.
3. Chargeback ratio: Look for number of chargebacks divided by total transactions, or similar metric.
4. Pricing model: Look for terms like "interchange-plus" or "tiered" or "flat rate".
5. List all monthly fees found in the statement (monthly fee, PCI fee, statement fee, batch fee, transaction fees, etc.)

DO NOT INVENT VALUES. If you cannot find data for any field, use "N/A" instead of making up a value.

Format your response as a valid JSON object with these exact fields:
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

ONLY respond with the JSON - no other text.`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText
            },
            {
              inline_data: {
                mime_type: fileType,
                data: base64File
              }
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.1,
        max_output_tokens: 4096
      }
    };
    
    console.log("Sending request to Gemini API");
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error response: ${response.status}`, errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Received response from Gemini API");
    
    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content.parts.length) {
      throw new Error('Gemini API returned no content');
    }
    
    const rawText = result.candidates[0].content.parts[0].text;
    console.log("Raw Gemini response:", rawText);
    
    // Extract JSON from the response
    // The response might contain text like ```json{...}``` or just plain JSON
    let jsonText = rawText;
    
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = rawText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1];
    }
    
    // Clean up any remaining markdown or text
    jsonText = jsonText.replace(/```json|```/g, '').trim();
    
    try {
      const analysisData = JSON.parse(jsonText);
      console.log("Parsed analysis data:", analysisData);
      
      // Ensure all required fields are present
      return {
        effectiveRate: analysisData.effectiveRate || "N/A",
        monthlyVolume: analysisData.monthlyVolume || "N/A",
        chargebackRatio: analysisData.chargebackRatio || "N/A",
        pricingModel: analysisData.pricingModel || "N/A",
        fees: {
          monthlyFee: analysisData.fees?.monthlyFee || "N/A",
          pciFee: analysisData.fees?.pciFee || "N/A",
          statementFee: analysisData.fees?.statementFee || "N/A",
          batchFee: analysisData.fees?.batchFee || "N/A",
          transactionFees: analysisData.fees?.transactionFees || "N/A"
        }
      };
    } catch (error) {
      console.error("Error parsing Gemini JSON response:", error);
      console.log("Failed JSON content:", jsonText);
      throw new Error("Failed to parse Gemini response as JSON");
    }
  } catch (error) {
    console.error('Error in analyzeWithGemini:', error);
    throw new Error(`Gemini analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
