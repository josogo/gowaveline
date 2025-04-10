
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
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated. Please log in to create documents.');
    }
    
    // Create a document object with the authenticated user's ID
    const documentToInsert = {
      ...document,
      uploaded_by: user.id
    };
    
    console.log('Creating document with data:', documentToInsert);
    
    // First try with normal client
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(documentToInsert)
        .select();

      if (!error) {
        console.log('Document created successfully:', data);
        return data[0] as DocumentItem;
      }
      
      // If there was an RLS error, log it but continue to try alternative method
      console.warn('Error with standard insert (might be RLS):', error);
    } catch (insertError) {
      console.warn('Standard insert failed:', insertError);
    }
    
    // If we're here, the normal insert failed - attempt to create document through the edge function
    console.log('Attempting to create document through edge function');
    
    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch('/api/documents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`
      },
      body: JSON.stringify(documentToInsert)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Edge function error: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Document created through edge function:', result);
    return result.document as DocumentItem;

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
  const { data, error } = await supabase.rpc('has_role', {
    user_id: userId,
    role: 'admin'
  });

  if (error) {
    console.error('Error checking admin role:', error);
    return false;
  }

  return !!data;
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
  formData: PreAppFormValues
): Promise<DocumentItem> {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated. Please log in to generate applications.');
    }
    
    console.log('Generating pre-app with user:', user.id);
    
    const metadata = {
      industryId,
      leadData,
      formData,
      generatedAt: new Date().toISOString()
    };
    
    // Call the Supabase Edge Function to generate the PDF
    console.log('Calling edge function to generate PDF');
    
    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch('/api/generate-pre-app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`
      },
      body: JSON.stringify({ industryId, leadData, formData })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PDF generation failed: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.pdfBase64) {
      throw new Error('No PDF data received from the server');
    }
    
    console.log('PDF generated successfully, saving to storage');
    
    // Upload the PDF to storage
    const filePath = `pre-apps/${Date.now()}-application.pdf`;
    const fileBlob = base64ToBlob(result.pdfBase64, 'application/pdf');
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileBlob);
      
    if (uploadError) {
      console.error('Error uploading PDF to storage:', uploadError);
      throw uploadError;
    }
    
    // Create document entry in the database
    const docData = {
      name: `Merchant Application - ${formData.businessName || formData.principalName || 'New'}`,
      description: `Pre-application form for ${formData.principalName || formData.businessName || 'merchant'}`,
      file_path: filePath,
      file_type: 'application/pdf',
      file_size: fileBlob.size,
      document_type: 'MERCHANT_APPLICATION' as DocumentItemType,
      metadata,
      is_template: false,
      uploaded_by: user.id
    };
    
    // Create the document
    console.log('Creating document entry for the generated PDF');
    return await createDocument(docData);
  } catch (error) {
    console.error('Error generating pre-app document:', error);
    throw error;
  }
}

// Helper function to convert base64 to Blob
function base64ToBlob(base64: string, type: string): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}
