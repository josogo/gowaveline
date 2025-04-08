
export type ContactStatus = 'new' | 'active' | 'inactive' | 'lead' | 'churned';
export type ContactType = 'lead' | 'client' | 'partner' | 'vendor' | 'prospect';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
  type: ContactType;
  status: ContactStatus;
  tags: string[];
  address?: string;
  lastContact?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  relatedDeals?: string[]; // Array of deal IDs related to this contact
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  type: ContactType;
  status: ContactStatus;
  tags: string[];
  address: string;
  notes: string;
  assignedTo: string;
}
