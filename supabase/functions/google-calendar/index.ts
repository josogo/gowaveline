
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to handle Google Calendar API calls
async function handleGoogleCalendarRequest(action, eventData, accessToken) {
  const GOOGLE_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY') || ''
  const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || ''
  const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || ''
  
  // Base URL for Google Calendar API
  const calendarApiBaseUrl = 'https://www.googleapis.com/calendar/v3'
  
  try {
    switch (action) {
      case 'create': {
        // Create a new event in Google Calendar
        const url = `${calendarApiBaseUrl}/calendars/primary/events?conferenceDataVersion=1`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Google Calendar API error:', response.status, errorText)
          throw new Error(`Google Calendar API error: ${response.status}`)
        }
        
        const data = await response.json()
        return data
      }
      
      case 'list': {
        // List events from Google Calendar
        let url = `${calendarApiBaseUrl}/calendars/primary/events?maxResults=100`
        
        if (eventData.timeMin) {
          url += `&timeMin=${encodeURIComponent(eventData.timeMin)}`
        }
        
        if (eventData.timeMax) {
          url += `&timeMax=${encodeURIComponent(eventData.timeMax)}`
        }
        
        if (eventData.syncToken) {
          url += `&syncToken=${encodeURIComponent(eventData.syncToken)}`
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Google Calendar API error:', response.status, errorText)
          throw new Error(`Google Calendar API error: ${response.status}`)
        }
        
        const data = await response.json()
        return data
      }
      
      case 'update': {
        // Update an existing event in Google Calendar
        const { eventId, event } = eventData
        const url = `${calendarApiBaseUrl}/calendars/primary/events/${eventId}?conferenceDataVersion=1`
        
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Google Calendar API error:', response.status, errorText)
          throw new Error(`Google Calendar API error: ${response.status}`)
        }
        
        const data = await response.json()
        return data
      }
      
      case 'delete': {
        // Delete an event from Google Calendar
        const { eventId } = eventData
        const url = `${calendarApiBaseUrl}/calendars/primary/events/${eventId}`
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Google Calendar API error:', response.status, errorText)
          throw new Error(`Google Calendar API error: ${response.status}`)
        }
        
        return { success: true, message: 'Event deleted successfully' }
      }
      
      case 'freeBusy': {
        // Check free/busy status
        const url = `${calendarApiBaseUrl}/freeBusy`
        
        const requestBody = {
          timeMin: eventData.timeMin,
          timeMax: eventData.timeMax,
          items: [{ id: 'primary' }]
        }
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Google Calendar API error:', response.status, errorText)
          throw new Error(`Google Calendar API error: ${response.status}`)
        }
        
        const data = await response.json()
        return data
      }
      
      default:
        return { 
          success: false, 
          message: `Invalid action: ${action}` 
        }
    }
  } catch (error) {
    console.error('Error in handleGoogleCalendarRequest:', error)
    throw error
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
    
    const { action, event, accessToken, timeMin, timeMax, syncToken, eventId } = await req.json()
    
    if (!action || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    // Create a composite object with all possible parameters
    const eventData = { event, timeMin, timeMax, syncToken, eventId }
    
    // Handle Google Calendar operation
    const calendarResult = await handleGoogleCalendarRequest(action, eventData, accessToken)
    
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
