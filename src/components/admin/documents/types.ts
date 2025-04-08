
import { User } from '@supabase/supabase-js';

export interface DocumentItem {
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
