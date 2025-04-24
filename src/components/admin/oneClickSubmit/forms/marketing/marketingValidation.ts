
import * as z from "zod";

export const marketingFormSchema = z.object({
  marketingChannels: z.record(z.boolean()).default({}),
  marketingClaims: z.string().min(10, "Please provide detailed information about your marketing claims"),
  cac: z.string()
    .refine(val => !isNaN(Number(val)), "Must be a valid number")
    .refine(val => Number(val) >= 0, "CAC must be a positive number"),
  ltv: z.string()
    .refine(val => !isNaN(Number(val)), "Must be a valid number")
    .refine(val => Number(val) >= 0, "LTV must be a positive number")
});

export type MarketingFormValues = z.infer<typeof marketingFormSchema>;
