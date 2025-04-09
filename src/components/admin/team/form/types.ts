
import { z } from "zod";

// Define the form schema for team member
export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.string().min(1, { message: "Role is required." }),
  commissionSplit: z.string().min(1, { message: "Commission split is required." }),
  processingVolume: z.string().min(1, { message: "Processing volume is required." }),
  revenueVolume: z.string().min(1, { message: "Revenue volume is required." }),
  profilePicture: z.string().optional()
});

export type TeamMemberFormData = z.infer<typeof formSchema>;
export type TeamMember = TeamMemberFormData & { id: string };
