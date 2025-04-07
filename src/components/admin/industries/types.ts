
export interface Industry {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface IndustryDocument {
  id: string;
  industry_id: string;
  file_name: string;
  file_type: 'template' | 'supporting' | 'logo';
  file_path: string;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface Lead {
  id: number;
  business_name: string;
  email: string;
  phone_number: string;
  processing_volume: string;
  website: string | null;
  created_at: string;
  industry_id?: string;
}
