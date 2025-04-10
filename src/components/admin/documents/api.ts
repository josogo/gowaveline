
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
    
    // Use the service role to bypass RLS for this operation
    // This is necessary if the RLS is too restrictive
    const { data, error } = await supabase
      .from('documents')
      .insert(documentToInsert)
      .select();

    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }

    return data[0] as DocumentItem;
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
    
    const metadata = {
      industryId,
      leadData,
      formData,
      generatedAt: new Date().toISOString()
    };
    
    const docData = {
      name: `Merchant Application - ${formData.businessName || formData.principalName || 'New'}`,
      description: `Pre-application form for ${formData.principalName || formData.businessName || 'merchant'}`,
      file_path: `pre-apps/${Date.now()}-application.pdf`,
      file_type: 'application/pdf',
      file_size: 0,
      document_type: 'MERCHANT_APPLICATION' as DocumentItemType,
      metadata,
      is_template: false
    };
    
    // Pass to createDocument which will handle authentication
    const newDoc = await createDocument(docData);
    
    return newDoc;
  } catch (error) {
    console.error('Error generating pre-app document:', error);
    throw error;
  }
}
