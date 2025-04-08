
import { Document, DocumentType } from './types';
import { supabase } from '@/integrations/supabase/client';

export async function fetchDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return data as Document[];
}

export async function fetchDocumentById(id: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    throw error;
  }

  return data as Document;
}

export async function createDocument(document: Partial<Document>): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select();

  if (error) {
    console.error('Error creating document:', error);
    throw error;
  }

  return data[0] as Document;
}

export async function updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating document with ID ${id}:`, error);
    throw error;
  }

  return data[0] as Document;
}

export async function deleteDocument(id: string): Promise<boolean> {
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
