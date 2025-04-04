
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
          error: 'Missing file URL' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Processing file: ${fileName}, Type: ${fileType}, URL available: ${Boolean(fileUrl)}`);

    // Check if OpenAI API key is available
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      const mockData = generateMockData();
      return new Response(
        JSON.stringify({ 
          success: true,
          ...mockData,
          isMockData: true,
          message: "Using simulated data. The system needs an OpenAI API key to process files."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Download the file using the signed URL
    console.log("Attempting to download file from signed URL");
    const fileResponse = await fetch(fileUrl);
    
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
    }
    
    // Get file as array buffer
    const fileBuffer = await fileResponse.arrayBuffer();
    console.log(`File downloaded successfully, size: ${fileBuffer.byteLength} bytes`);

    try {
      // Process with OpenAI
      console.log("Processing with OpenAI API");
      const analysisResult = await processWithOpenAI(fileBuffer, fileType);
      console.log("OpenAI analysis complete");

      return new Response(
        JSON.stringify({ 
          success: true,
          ...analysisResult,
          isMockData: false,
          message: "Analysis complete using OpenAI."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } catch (aiError) {
      console.error("OpenAI analysis failed:", aiError);
      
      // Fallback to mock data if AI processing fails
      const mockData = generateMockData();
      return new Response(
        JSON.stringify({ 
          success: true,
          ...mockData,
          isMockData: true,
          error: aiError instanceof Error ? aiError.message : 'Unknown error in AI processing',
          message: "Using simulated data due to an error in processing your file with OpenAI."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
  } catch (error) {
    console.error('Error in edge function:', error);
    // Return a proper error response with mock data as fallback
    const mockData = generateMockData();
    return new Response(
      JSON.stringify({ 
        success: true,
        ...mockData,
        isMockData: true,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: "Using simulated data due to an error in processing your request."
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
    // Prepare the request payload for OpenAI
    const payload = {
      model: "gpt-4o", // Using GPT-4o which has vision capabilities for PDF analysis
      messages: [
        {
          role: "system",
          content: `You are a financial analysis assistant specialized in analyzing merchant processing statements. 
          Extract and calculate key metrics such as effective rate, monthly volume, pricing model, and fee structure. 
          Return your analysis in a structured format with exactly these fields:
          - effectiveRate (format: "X.XX%")
          - monthlyVolume (format: "$X,XXX.XX")
          - chargebackRatio (format: "0.XX%")
          - pricingModel (e.g., "Tiered", "Interchange-plus", etc.)
          - fees (an object with monthlyFee, pciFee, statementFee, batchFee, and transactionFees)`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Please analyze this merchant statement and extract the key metrics." 
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
    console.log("Sending request to OpenAI API");
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
    console.log("OpenAI response received", responseData);
    
    // Extract the response content
    const aiResponse = responseData.choices[0].message.content;
    
    // Parse the response from OpenAI
    // We need to extract the JSON part from the possibly markdown-formatted response
    let analysisData;
    try {
      // Try to parse the whole response as JSON
      analysisData = JSON.parse(aiResponse);
    } catch (e) {
      console.log("Couldn't parse entire response as JSON, looking for JSON block");
      
      // Try to find JSON block in markdown
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        analysisData = JSON.parse(jsonMatch[1]);
      } else {
        // If we can't parse the response, throw an error
        throw new Error("Failed to parse OpenAI response into valid JSON format");
      }
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
    
    return formattedResponse;
  } catch (error) {
    console.error("Error in processWithOpenAI:", error);
    throw error;
  }
}

/**
 * Generate realistic mock data for testing the UI
 */
function generateMockData() {
  return {
    effectiveRate: "2.45%",
    monthlyVolume: "$42,850.75",
    chargebackRatio: "0.05%",
    pricingModel: "Tiered",
    fees: {
      monthlyFee: "$25.00",
      pciFee: "$19.95",
      statementFee: "$9.95",
      batchFee: "$0.25",
      transactionFees: "$0.10 per transaction + 1.85% for qualified cards"
    }
  };
}
