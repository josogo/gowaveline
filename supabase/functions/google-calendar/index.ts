
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to handle Google Calendar API calls
async function handleGoogleCalendarRequest(action, eventData) {
  const GOOGLE_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY') || ''
  const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || ''
  const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || ''
  
  // Here you would implement the OAuth flow and calendar API operations
  // For this example, we'll just return a success message
  
  switch (action) {
    case 'create':
      // Would implement actual Google Calendar API call here
      return { 
        success: true, 
        message: 'Event created successfully',
        mockEventId: `google_${Date.now()}`
      }
    case 'update':
      return { 
        success: true, 
        message: 'Event updated successfully' 
      }
    case 'delete':
      return { 
        success: true, 
        message: 'Event deleted successfully' 
      }
    default:
      return { 
        success: false, 
        message: 'Invalid action' 
      }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { action, event } = await req.json()
    
    if (!action || !event) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    // Handle Google Calendar operation
    const calendarResult = await handleGoogleCalendarRequest(action, event)
    
    // Store event in database
    if (calendarResult.success && action === 'create') {
      const { data: dbData, error: dbError } = await supabaseClient
        .from('calendar_events')
        .insert({
          title: event.title,
          description: event.description,
          start_time: event.start_time,
          end_time: event.end_time,
          attendees: event.attendees,
          google_event_id: calendarResult.mockEventId,
          related_contact_id: event.contactId,
          related_deal_id: event.dealId,
          meeting_link: event.meeting_link,
          status: 'scheduled'
        })
        
      if (dbError) {
        console.error('Database error:', dbError)
        return new Response(
          JSON.stringify({ error: 'Error saving event', details: dbError }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
    }
    
    return new Response(
      JSON.stringify(calendarResult),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
