
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

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

    const formData = await req.formData()
    const file = formData.get('file') as File
    const docType = formData.get('docType') as string
    const entityId = formData.get('entityId') as string 
    const entityType = formData.get('entityType') as string // 'merchant' or 'agent'
    const userName = formData.get('userName') as string
    const effectiveDate = formData.get('effectiveDate') as string
    const expirationDate = formData.get('expirationDate') as string

    if (!file || !docType || !entityId || !entityType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Determine the bucket based on entityType
    const bucketId = entityType === 'merchant' ? 'merchant_documents' : 'agent_agreements'
    
    // Upload file to storage
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const filePath = `${entityId}/${docType}_${timestamp}.${fileExt}`
    
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from(bucketId)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return new Response(
        JSON.stringify({ error: 'Error uploading file', details: storageError }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from(bucketId)
      .getPublicUrl(filePath)

    // Save document metadata to the appropriate table
    let dbResult
    if (entityType === 'merchant') {
      dbResult = await supabaseClient
        .from('merchant_documents')
        .insert({
          merchant_id: entityId,
          document_type: docType,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: userName
        })
    } else {
      // For agent agreements
      dbResult = await supabaseClient
        .from('agent_agreements')
        .insert({
          agent_id: entityId,
          agreement_type: docType,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          effective_date: effectiveDate || null,
          expiration_date: expirationDate || null
        })
    }

    if (dbResult.error) {
      console.error('Database error:', dbResult.error)
      return new Response(
        JSON.stringify({ error: 'Error saving document metadata', details: dbResult.error }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        filePath: filePath,
        publicUrl: publicUrl,
        metadata: dbResult.data
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
