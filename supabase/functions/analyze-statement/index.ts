
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Basic check for API key and return mock data if not available
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key not configured");
      const mockData = generateMockData();
      return new Response(
        JSON.stringify({ 
          success: true,
          ...mockData,
          isMockData: true,
          error: 'Gemini API key not configured',
          message: "Using simulated data. The system needs a Google Gemini API key to process files."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Instead of downloading the file, let's just return mock data for now
    // This helps us test if the flow works end-to-end
    const mockData = generateMockData();
    return new Response(
      JSON.stringify({ 
        success: true,
        ...mockData,
        isMockData: true,
        message: "Using simulated data for testing purposes."
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in edge function:', error);
    // If all else fails, still return mock data to avoid breaking the UI
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
 * Generate mock data for testing the UI
 * This is used as a fallback when Gemini processing fails
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
