
// This file is used only for re-exporting the Toaster component from sonner
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster({ ...props }) {
  return (
    <SonnerToaster 
      position="top-right"
      {...props}
    />
  )
}
