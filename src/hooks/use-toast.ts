
import { toast as sonnerToast, ToastT } from "sonner";

export type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export const toast = (props: ToastProps) => {
  return sonnerToast[props.variant === "destructive" ? "error" : "success"](props.title, {
    description: props.description,
  });
};

export const useToast = () => {
  return {
    toast,
  };
};
