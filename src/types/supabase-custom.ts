
// Custom type definitions for Supabase tables to use with TypeScript
// This augments the auto-generated types without modifying them

export interface CalendarEvent {
  id: string;
  google_event_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees?: Array<{ email: string; name?: string }>;
  meeting_link?: string;
  status: string;
  related_contact_id?: string;
  related_deal_id?: string;
  created_at: string;
  calendly_event_id?: string;
}

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
  isStandard?: boolean;
}

export type DocumentItemType = 'template' | 'contract' | 'nda' | 'agreement' | 'preapp' | 'other';

// Type helper for Supabase queries
export const typedSupabaseQuery = {
  from: <T>(table: string) => {
    return { table, cast: <T>() => {} };
  }
};
