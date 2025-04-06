
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    const { tableName, recordId, fieldName, newValue, userId } = await req.json()
    
    if (!tableName || !recordId || !fieldName || newValue === undefined || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    // Get current value for audit trail
    const { data: currentData, error: selectError } = await supabaseClient
      .from(tableName)
      .select(fieldName)
      .eq('id', recordId)
      .single()
    
    if (selectError) {
      return new Response(
        JSON.stringify({ error: 'Error retrieving current value', details: selectError }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    const oldValue = currentData ? currentData[fieldName] : null
    
    // Update the field
    const { data, error: updateError } = await supabaseClient
      .from(tableName)
      .update({ [fieldName]: newValue })
      .eq('id', recordId)
      
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Error updating field', details: updateError }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    // Record the change in field_edit_history
    const { error: historyError } = await supabaseClient
      .from('field_edit_history')
      .insert({
        table_name: tableName,
        record_id: recordId,
        field_name: fieldName,
        old_value: oldValue !== null ? String(oldValue) : null,
        new_value: newValue !== null ? String(newValue) : null,
        changed_by: userId
      })
      
    if (historyError) {
      console.error('History logging error:', historyError)
      // We don't fail the request if just the history logging fails
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Field ${fieldName} updated successfully`,
        newValue: newValue
      }),
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
