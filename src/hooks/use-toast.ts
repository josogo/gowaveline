
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  status?: "info" | "warning" | "success" | "error";
  duration?: number;
  isClosable?: boolean;
};

function useToast() {
  return (props: ToastProps) => {
    const { title, description, status, duration = 3000, isClosable = true } = props;
    
    switch (status) {
      case "info":
        return sonnerToast.info(title, {
          description,
          duration,
          dismissible: isClosable,
        });
      case "warning":
        return sonnerToast.warning(title, {
          description,
          duration,
          dismissible: isClosable,
        });
      case "success":
        return sonnerToast.success(title, {
          description,
          duration,
          dismissible: isClosable,
        });
      case "error":
        return sonnerToast.error(title, {
          description,
          duration,
          dismissible: isClosable,
        });
      default:
        return sonnerToast(title, {
          description,
          duration,
          dismissible: isClosable,
        });
    }
  };
}

// Export the hook and also a direct toast function
export { useToast };
export const toast = (props: ToastProps) => {
  const { title, description, status, duration = 3000, isClosable = true } = props;
  
  switch (status) {
    case "info":
      return sonnerToast.info(title, {
        description,
        duration,
        dismissible: isClosable,
      });
    case "warning":
      return sonnerToast.warning(title, {
        description,
        duration,
        dismissible: isClosable,
      });
    case "success":
      return sonnerToast.success(title, {
        description,
        duration,
        dismissible: isClosable,
      });
    case "error":
      return sonnerToast.error(title, {
        description,
        duration,
        dismissible: isClosable,
      });
    default:
      return sonnerToast(title, {
        description,
        duration,
        dismissible: isClosable,
      });
  }
};
