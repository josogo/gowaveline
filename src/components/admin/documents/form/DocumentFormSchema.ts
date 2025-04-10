
import { z } from 'zod';

export const documentFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  document_type: z.enum(['template', 'contract', 'nda', 'agreement', 'preapp', 'other'] as const),
  is_template: z.boolean().default(false),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
