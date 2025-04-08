
import { z } from 'zod';
import { ContactType, ContactStatus } from '../types';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(5, { message: 'Please enter a valid phone number' }),
  company: z.string().optional(),
  title: z.string().optional(),
  type: z.enum(['lead', 'client', 'partner', 'vendor', 'prospect'] as const),
  status: z.enum(['new', 'active', 'inactive', 'lead', 'churned'] as const),
  tags: z.array(z.string()).default([]),
  address: z.string().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
});
