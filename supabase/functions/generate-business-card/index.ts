
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { agentData } = await req.json()
    
    // Simple HTML template for business card (front and back)
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        @page { 
            size: 3.5in 2in; 
            margin: 0.125in; 
        }
        body { 
            margin: 0; 
            font-family: Arial, sans-serif; 
            width: 3.25in; 
            height: 1.75in; 
        }
        .card-front {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 0.3in;
            height: 1.75in;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
        }
        .card-back {
            background: white;
            border: 2px solid #e5e7eb;
            padding: 0.3in;
            height: 1.75in;
            box-sizing: border-box;
            color: #1f2937;
        }
        .logo {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 0.1in;
        }
        .tagline {
            font-size: 11px;
            opacity: 0.9;
            font-weight: 500;
        }
        .agent-info h3 {
            margin: 0 0 0.05in 0;
            font-size: 16px;
            font-weight: bold;
        }
        .agent-info p {
            margin: 0 0 0.03in 0;
            font-size: 11px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin: 0.02in 0;
        }
        .icon {
            width: 12px;
            height: 12px;
            margin-right: 0.05in;
        }
    </style>
</head>
<body>
    <!-- Front Side -->
    <div class="card-front">
        <div>
            <div class="logo">WaveLine</div>
        </div>
        <div>
            <div class="tagline">Your Partner in High-Risk Merchant Services</div>
        </div>
    </div>
    
    <!-- Back Side -->
    <div class="card-back">
        <div class="agent-info">
            <h3>${agentData.name || '[Your Name]'}</h3>
            <p style="color: #6b7280; margin-bottom: 0.1in;">${agentData.title || '[Your Title]'}</p>
            <div class="contact-item">
                <span class="icon">📞</span>
                <span>${agentData.phone || '[Your Phone Number]'}</span>
            </div>
            <div class="contact-item">
                <span class="icon">✉️</span>
                <span>${agentData.email || '[Your Email]'}</span>
            </div>
            <div class="contact-item">
                <span class="icon">🌐</span>
                <span>${agentData.website || '[Company Website]'}</span>
            </div>
        </div>
    </div>
</body>
</html>
    `

    // For this example, we'll return the HTML. In production, you'd convert this to PDF
    // using a library like Puppeteer or similar
    const response = new Response(htmlTemplate, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="business-card-${agentData.name || 'template'}.html"`,
      },
    })

    return response

  } catch (error) {
    console.error('Error generating business card:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate business card' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
