
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
  uploaded_by: string;
  document_type: DocumentItemType;
  metadata?: any;
  is_template: boolean;
}): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select();

  if (error) {
    console.error('Error creating document:', error);
    throw error;
  }

  return data[0] as DocumentItem;
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
  // First get the document to get file path
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    console.error(`Error fetching document with ID ${id}:`, fetchError);
    throw fetchError;
  }
  
  // Delete the file from storage first
  if (document?.file_path) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error(`Error deleting file from storage:`, storageError);
      // Continue with deletion of database record even if storage deletion fails
    }
  }
  
  // Now delete the database record
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

// Add the missing functions for PreAppGenerationDialog.tsx

// Define the Industry type
interface Industry {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

// Function to fetch industries
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

// Function to generate pre-application document
export async function generatePreApp(
  industryId: string,
  leadData: any,
  formData: PreAppFormValues
): Promise<DocumentItem> {
  // Implement the actual logic to generate a pre-app document
  // This is a simplified implementation - in a real app, you might call an API endpoint
  // that generates a PDF and stores it in Supabase storage
  
  try {
    // Create a metadata object that combines lead and form data
    const metadata = {
      industryId,
      leadData,
      formData,
      generatedAt: new Date().toISOString()
    };
    
    // Create a document entry in the database
    const docData = {
      name: `Merchant Application - ${formData.businessStructure || 'New'}`,
      description: `Pre-application form for ${formData.principalName || 'merchant'}`,
      file_path: `pre-apps/${Date.now()}-application.pdf`,
      file_type: 'application/pdf',
      file_size: 0, // This would be the actual size if we were creating a real PDF
      uploaded_by: 'system',
      document_type: 'MERCHANT_APPLICATION' as DocumentItemType,
      metadata,
      is_template: false
    };
    
    // Store the document record
    const newDoc = await createDocument(docData);
    
    return newDoc;
  } catch (error) {
    console.error('Error generating pre-app document:', error);
    throw error;
  }
}
