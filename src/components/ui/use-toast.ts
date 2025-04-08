
// Re-export toast from our main hook implementation to maintain compatibility
import { useToast, toast } from "@/hooks/use-toast";
import type { ToastProps } from "@/hooks/use-toast";

export { useToast, toast };
export type { ToastProps };
