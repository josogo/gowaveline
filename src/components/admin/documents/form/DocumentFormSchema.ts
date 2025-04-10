
import { z } from 'zod';

export const documentFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  document_type: z.enum(['template', 'contract', 'nda', 'agreement', 'preapp', 'other']),
  is_template: z.boolean().default(false),
});

// Define the DocumentType explicitly to match the enum in the schema
export type DocumentType = 'template' | 'contract' | 'nda' | 'agreement' | 'preapp' | 'other';
export type DocumentFormValues = z.infer<typeof documentFormSchema>;
