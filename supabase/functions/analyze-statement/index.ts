
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

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
          effectiveRate: "N/A",
          monthlyVolume: "N/A",
          chargebackRatio: "N/A",
          pricingModel: "N/A",
          fees: {
            monthlyFee: "N/A",
            pciFee: "N/A",
            statementFee: "N/A",
            batchFee: "N/A",
            transactionFees: "N/A"
          },
          error: 'Missing file URL',
          message: 'Please upload a file to analyze.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Processing file: ${fileName}, Type: ${fileType}, URL available: ${Boolean(fileUrl)}`);

    // Check if OpenAI API key is available
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ 
          success: false,
          effectiveRate: "N/A",
          monthlyVolume: "N/A",
          chargebackRatio: "N/A",
          pricingModel: "N/A",
          fees: {
            monthlyFee: "N/A",
            pciFee: "N/A",
            statementFee: "N/A",
            batchFee: "N/A",
            transactionFees: "N/A"
          },
          error: "OpenAI API key is not configured. Please add your API key in settings.",
          message: "Unable to analyze without an OpenAI API key."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Download the file using the signed URL
    console.log("Attempting to download file from signed URL");
    const fileResponse = await fetch(fileUrl);
    
    if (!fileResponse.ok) {
      console.error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
      throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
    }
    
    // Get file as array buffer
    const fileBuffer = await fileResponse.arrayBuffer();
    console.log(`File downloaded successfully, size: ${fileBuffer.byteLength} bytes`);

    try {
      // Process with OpenAI
      console.log("Processing with OpenAI API - starting");
      const analysisResult = await processWithOpenAI(fileBuffer, fileType);
      console.log("OpenAI analysis complete with result:", analysisResult);

      return new Response(
        JSON.stringify({ 
          success: true,
          ...analysisResult,
          message: "Analysis complete using OpenAI."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } catch (aiError) {
      console.error("OpenAI analysis failed:", aiError);
      
      // Return N/A for all fields
      return new Response(
        JSON.stringify({ 
          success: false,
          effectiveRate: "N/A",
          monthlyVolume: "N/A",
          chargebackRatio: "N/A",
          pricingModel: "N/A",
          fees: {
            monthlyFee: "N/A",
            pciFee: "N/A",
            statementFee: "N/A",
            batchFee: "N/A",
            transactionFees: "N/A"
          },
          error: aiError instanceof Error ? aiError.message : 'Unknown error in AI processing',
          message: "Unable to extract data from your statement. The file might be in a format that's difficult to analyze."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
  } catch (error) {
    console.error('Error in edge function:', error);
    // Return N/A values
    return new Response(
      JSON.stringify({ 
        success: false,
        effectiveRate: "N/A",
        monthlyVolume: "N/A",
        chargebackRatio: "N/A",
        pricingModel: "N/A",
        fees: {
          monthlyFee: "N/A",
          pciFee: "N/A",
          statementFee: "N/A",
          batchFee: "N/A",
          transactionFees: "N/A"
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        message: "An error occurred while processing your request."
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

/**
 * Process the file with OpenAI API
 */
async function processWithOpenAI(fileBuffer: ArrayBuffer, fileType: string): Promise<any> {
  // Convert ArrayBuffer to base64
  const uint8Array = new Uint8Array(fileBuffer);
  const fileBase64 = base64Encode(uint8Array);
  
  console.log(`Processing with OpenAI, file size: ${fileBase64.length} bytes`);
  
  // Determine the MIME type based on the fileType
  let mimeType = fileType;
  if (!mimeType.includes('/')) {
    // If fileType doesn't contain a slash, it's likely a file extension
    if (fileType.toLowerCase().includes('pdf')) {
      mimeType = 'application/pdf';
    } else if (fileType.toLowerCase().includes('csv')) {
      mimeType = 'text/csv';
    } else {
      mimeType = 'application/octet-stream';
    }
  }
  
  try {
    // Test the OpenAI API with a simple request first
    console.log("Testing OpenAI API connection with a simple request");
    const testResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: "Hello, this is a test message. Please respond with 'OpenAI API is working.'" }
        ]
      })
    });
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error(`OpenAI API test failed: ${testResponse.status} ${errorText}`);
      throw new Error(`OpenAI API test failed: ${testResponse.status} ${errorText}`);
    } else {
      console.log("OpenAI API test successful");
    }
    
    // Prepare the request payload for OpenAI
    const payload = {
      model: "gpt-4o", // Using GPT-4o which has vision capabilities for PDF analysis
      messages: [
        {
          role: "system",
          content: `You are a financial analysis assistant specialized in analyzing merchant processing statements. 
          Extract and calculate key metrics such as effective rate, monthly volume, pricing model, and fee structure. 
          If you cannot determine a specific value with confidence, use "N/A" instead of guessing.
          Return your analysis in a structured format with exactly these fields:
          - effectiveRate (format: "X.XX%" or "N/A")
          - monthlyVolume (format: "$X,XXX.XX" or "N/A")
          - chargebackRatio (format: "0.XX%" or "N/A")
          - pricingModel (e.g., "Tiered", "Interchange-plus", etc. or "N/A")
          - fees (an object with monthlyFee, pciFee, statementFee, batchFee, and transactionFees, all can be "N/A")`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Please analyze this merchant statement and extract the key metrics. If you cannot find a specific value, use N/A. Do not invent data." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${fileBase64}`
              }
            }
          ]
        }
      ]
    };
    
    // Call OpenAI API
    console.log("Sending request to OpenAI API for document analysis");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error response: ${response.status} ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log("OpenAI response received:", responseData);
    
    // Extract the response content
    const aiResponse = responseData.choices[0].message.content;
    console.log("AI response content:", aiResponse);
    
    // Parse the response from OpenAI
    // We need to extract the JSON part from the possibly markdown-formatted response
    let analysisData;
    try {
      // Try to parse the whole response as JSON
      analysisData = JSON.parse(aiResponse);
      console.log("Successfully parsed entire response as JSON");
    } catch (e) {
      console.log("Couldn't parse entire response as JSON, looking for JSON block");
      
      // Try to find JSON block in markdown
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          analysisData = JSON.parse(jsonMatch[1]);
          console.log("Successfully extracted and parsed JSON from markdown block");
        } catch (jsonError) {
          console.error("Error parsing JSON from markdown block:", jsonError);
          throw new Error("Failed to parse JSON from OpenAI response");
        }
      } else {
        // Last attempt - try to extract key-value pairs from text
        console.log("No JSON block found, attempting to extract structured data from text");
        
        // Simple extraction of key-value pairs
        analysisData = {
          effectiveRate: extractValue(aiResponse, "effectiveRate", "N/A"),
          monthlyVolume: extractValue(aiResponse, "monthlyVolume", "N/A"),
          chargebackRatio: extractValue(aiResponse, "chargebackRatio", "N/A"),
          pricingModel: extractValue(aiResponse, "pricingModel", "N/A"),
          fees: {
            monthlyFee: extractValue(aiResponse, "monthlyFee", "N/A"),
            pciFee: extractValue(aiResponse, "pciFee", "N/A"),
            statementFee: extractValue(aiResponse, "statementFee", "N/A"),
            batchFee: extractValue(aiResponse, "batchFee", "N/A"),
            transactionFees: extractValue(aiResponse, "transactionFees", "N/A")
          }
        };
        console.log("Extracted structured data from text:", analysisData);
      }
    }
    
    if (!analysisData) {
      throw new Error("Failed to parse OpenAI response into a usable format");
    }
    
    // Validate and format the response
    const formattedResponse = {
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
    
    console.log("Final formatted response:", formattedResponse);
    return formattedResponse;
  } catch (error) {
    console.error("Error in processWithOpenAI:", error);
    throw error;
  }
}

/**
 * Helper function to extract values from text response
 */
function extractValue(text: string, key: string, defaultValue: string): string {
  const regex = new RegExp(`${key}[:\\s]+"?([^"\n,]+)"?`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : defaultValue;
}
