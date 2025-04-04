
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Always return mock data for reliable testing
    const mockData = generateMockData();
    return new Response(
      JSON.stringify({ 
        success: true,
        ...mockData,
        message: "Analysis complete."
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in edge function:', error);
    // Return a proper error response
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

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
