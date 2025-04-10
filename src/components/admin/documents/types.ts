
export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  document_type?: string;
  is_template?: boolean;
  created_at: string;
  uploaded_by?: string;
  owner_id?: string;
  metadata?: any;
  isStandard?: boolean; // Flag to identify standard pre-loaded documents
}

// Renamed this type to avoid conflicts with DocumentType from form schema
export type DocumentItemType = 'template' | 'contract' | 'nda' | 'agreement' | 'preapp' | 'other';

export interface DocumentUploadFormData {
  name: string;
  description?: string;
  document_type: string;
  is_template: boolean;
  file?: File;
}
