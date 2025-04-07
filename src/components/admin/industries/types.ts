
import { supabase } from '@/integrations/supabase/client';

export interface Industry {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface IndustryDocument {
  id: string;
  industry_id: string;
  file_name: string;
  file_type: 'template' | 'supporting' | 'logo';
  file_path: string;
  uploaded_by?: string | null;
  uploaded_at?: string;
  file_size?: number;
}

export interface Lead {
  id: number;
  business_name: string;
  email: string;
  phone_number: string;
  website?: string;
  processing_volume: string;
  created_at?: string;
}

// Fetch a specific industry by ID
export const fetchIndustryById = async (id: string): Promise<Industry | null> => {
  try {
    const response = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/industries?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`
        }
      }
    );
    
    const data = await response.json();
    
    return data && data.length > 0 ? data[0] as Industry : null;
  } catch (error) {
    console.error('Error fetching industry:', error);
    return null;
  }
};

// Fetch all industries
export const fetchIndustries = async (): Promise<Industry[]> => {
  try {
    const response = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/industries?select=*&order=name.asc`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`
        }
      }
    );
    
    const data = await response.json();
    
    return data as Industry[];
  } catch (error) {
    console.error('Error fetching industries:', error);
    return [];
  }
};

// Fetch documents for a specific industry
export const fetchDocumentsByIndustryId = async (industryId: string): Promise<IndustryDocument[]> => {
  try {
    const response = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/industry_documents?industry_id=eq.${industryId}&select=*`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`
        }
      }
    );
    
    const data = await response.json();
    
    return data as IndustryDocument[];
  } catch (error) {
    console.error('Error fetching industry documents:', error);
    return [];
  }
};

// Fetch all leads (used for PDF generation)
export const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/leads?select=*&order=business_name.asc`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`
        }
      }
    );
    
    const data = await response.json();
    
    return data as Lead[];
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Add a new industry
export const addIndustry = async (industry: { name: string, description: string | null }): Promise<Industry[]> => {
  try {
    const response = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/industries`,
      {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(industry)
      }
    );
    
    const data = await response.json();
    
    return data as Industry[];
  } catch (error) {
    console.error('Error adding industry:', error);
    throw new Error('Failed to add industry');
  }
};

// Add a new industry document
export const addIndustryDocument = async (document: {
  industry_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  uploaded_by?: string | null;
}): Promise<IndustryDocument> => {
  try {
    const response = await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/industry_documents`,
      {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(document)
      }
    );
    
    const data = await response.json();
    
    return data[0] as IndustryDocument;
  } catch (error) {
    console.error('Error adding document:', error);
    throw new Error('Failed to add document');
  }
};

// Delete an industry document
export const deleteIndustryDocument = async (id: string): Promise<void> => {
  try {
    await fetch(
      `https://rqwrvkkfixrogxogunsk.supabase.co/rest/v1/industry_documents?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY`
        }
      }
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
};
