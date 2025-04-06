
export type ContactStatus = 'new' | 'active' | 'inactive' | 'lead' | 'churned';
export type ContactType = 'lead' | 'client' | 'partner' | 'vendor';

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
