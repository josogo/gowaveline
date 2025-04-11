import { DocumentItem, DocumentItemType } from './types';
import { supabase } from '@/integrations/supabase/client';
import { PreAppFormValues } from './PreAppFormSchema';

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return data as DocumentItem[];
}

export async function fetchDocumentById(id: string): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    throw error;
  }

  return data as DocumentItem;
}

export async function createDocument(document: {
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  owner_id?: string;
  uploaded_by?: string;
  document_type: DocumentItemType;
  metadata?: any;
  is_template: boolean;
}): Promise<DocumentItem> {
  try {
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication error: Could not get session');
    }
    
    const session = data?.session;
    const user = session?.user;
    
    if (!user) {
      throw new Error('User not authenticated. Please log in to create documents.');
    }
    
    console.log('Creating document with authenticated user:', user.id);
    
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      user_id: user.id,
      role: 'admin'
    });
    
    if (roleError) {
      console.error('Error checking admin role:', roleError);
      throw new Error('Failed to verify permission level');
    }
    
    if (!isAdmin) {
      console.error('User is not admin:', user.id);
      throw new Error('Admin permissions required to create documents');
    }
    
    console.log('Admin role verified for user:', user.id);
    console.log('Creating document with data:', document);
    
    const documentToInsert = {
      ...document,
      uploaded_by: user.id
    };
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(documentToInsert)
        .select();

      if (!error) {
        console.log('Document created successfully:', data);
        return data[0] as DocumentItem;
      }
      
      console.warn('Error with standard insert (might be RLS):', error);
    } catch (insertError) {
      console.warn('Standard insert failed:', insertError);
    }
    
    if (!session?.access_token) {
      throw new Error('No valid session token found. Please log in again.');
    }
    
    try {
      const response = await fetch('/api/documents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(documentToInsert)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Edge function error';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || response.statusText;
        } catch {
          errorMessage = `${errorMessage}: ${errorText || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Document created through edge function:', result);
      return result.document as DocumentItem;
    } catch (fetchError: any) {
      console.error('Error calling document creation edge function:', fetchError);
      throw new Error(`Edge function error: ${fetchError.message}`);
    }

  } catch (error) {
    console.error('Error in createDocument:', error);
    throw error;
  }
}

function isValidUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function updateDocument(id: string, updates: Partial<DocumentItem>): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating document with ID ${id}:`, error);
    throw error;
  }

  return data[0] as DocumentItem;
}

export async function deleteDocument(id: string): Promise<boolean> {
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    console.error(`Error fetching document with ID ${id}:`, fetchError);
    throw fetchError;
  }
  
  if (document?.file_path) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error(`Error deleting file from storage:`, storageError);
      // Continue with deletion of database record even if storage deletion fails
    }
  }
  
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting document with ID ${id}:`, error);
    throw error;
  }

  return true;
}

export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'admin'
    });

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return !!data;
  } catch (e) {
    console.error('Exception checking admin role:', e);
    return false;
  }
}

interface Industry {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export async function fetchIndustries(): Promise<Industry[]> {
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }

  return data as Industry[];
}

export async function generatePreApp(
  industryId: string,
  leadData: any,
  formData: any
): Promise<any> {
  try {
    console.log('[GENERATE_PRE_APP] Starting generatePreApp function with industry:', industryId);
    
    const edgeFunctionUrl = 'https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/generate-pre-app';
    console.log('[GENERATE_PRE_APP] Calling edge function URL:', edgeFunctionUrl);
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ industryId, formData })
    });
    
    console.log('[GENERATE_PRE_APP] Edge function response status:', response.status);
    
    const responseText = await response.text();
    console.log('[GENERATE_PRE_APP] Raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[GENERATE_PRE_APP] Error parsing response as JSON:', parseError);
      throw new Error(`Failed to parse response from PDF generation service: ${responseText.substring(0, 100)}...`);
    }
    
    if (!response.ok) {
      const errorMessage = result?.error || response.statusText || 'Unknown error';
      console.error('[GENERATE_PRE_APP] Error response from edge function:', { 
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      throw new Error(`PDF generation failed: ${errorMessage}`);
    }
    
    if (!result.pdfBase64) {
      console.error('[GENERATE_PRE_APP] No PDF data in response:', result);
      throw new Error('No PDF data received from the server');
    }
    
    console.log('[GENERATE_PRE_APP] PDF generated successfully, creating mock result');
    
    // Create a mock result for now
    return {
      id: 'mock-id-' + Date.now(),
      name: `Merchant Application - ${formData.businessName || formData.principalName || 'New'}`,
      file_path: 'pre-apps/mock-application.pdf',
      created_at: new Date().toISOString()
    };
    
  } catch (error: any) {
    console.error('[GENERATE_PRE_APP] Error generating pre-app document:', error);
    throw error;
  }
}

function base64ToBlob(base64: string, type: string): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}
