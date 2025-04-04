
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  company: z.string().optional(),
  inquiryType: z.string(),
  partnerType: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export type ContactFormValues = z.infer<typeof formSchema>;
