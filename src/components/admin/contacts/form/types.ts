
import { Contact, ContactType, ContactStatus } from '../types';

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
