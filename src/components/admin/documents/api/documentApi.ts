
import { DocumentItem, DocumentItemType } from '../types';
import { supabase } from '@/integrations/supabase/client';

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false }) as any;

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
    .single() as any;

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
    }) as any;
    
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
        .select() as any;

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

export async function updateDocument(id: string, updates: Partial<DocumentItem>): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from('documents')
    .update(updates as any)
    .eq('id', id)
    .select() as any;

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
    .single() as any;
    
  if (fetchError) {
    console.error(`Error fetching document with ID ${id}:`, fetchError);
    throw fetchError;
  }
  
  // Check if document exists and has a file_path
  if (document && document.file_path) {
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
    .eq('id', id) as any;

  if (error) {
    console.error(`Error deleting document with ID ${id}:`, error);
    throw error;
  }

  return true;
}
