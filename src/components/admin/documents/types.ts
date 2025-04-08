
import { User } from '@supabase/supabase-js';

export interface Document {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  owner_id?: string;
  uploaded_by: string;
  document_type: DocumentType;
  created_at: string;
  metadata?: any;
  is_template: boolean;
}

export type DocumentType = 'template' | 'contract' | 'preapp' | 'other';

export interface DocumentFormValues {
  name: string;
  description: string;
  document_type: DocumentType;
  is_template: boolean;
  owner_id?: string;
}

export interface FileWithPreview extends File {
  preview: string;
}

export async function fetchDocuments() {
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

export async function fetchDocumentById(id: string) {
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

export async function createDocument(document: Partial<Document>) {
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

export async function updateDocument(id: string, updates: Partial<Document>) {
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

export async function deleteDocument(id: string) {
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

export async function getUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return data;
}

export async function checkUserIsAdmin(userId: string) {
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

import { supabase } from '@/integrations/supabase/client';
