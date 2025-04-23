
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCcw } from 'lucide-react';

const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validation schema
const formSchema = z.object({
  merchantName: z.string().min(2, "Merchant name is required"),
  merchantEmail: z.string().email("Enter a valid email address"),
});

type SendToMerchantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationData: any; // The current application data
};

export const SendToMerchantDialog: React.FC<SendToMerchantDialogProps> = ({ 
  open, 
  onOpenChange,
  applicationData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [linkSent, setLinkSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantName: "",
      merchantEmail: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Generate OTP
      const generatedOTP = generateOTP();
      setOtp(generatedOTP);
      
      // Save application data with OTP
      const applicationId = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48); // OTP expires in 48 hours
      
      // Send email with link and OTP
      const { error } = await supabase.functions.invoke('send-merchant-email', {
        body: {
          merchantName: values.merchantName,
          merchantEmail: values.merchantEmail,
          applicationData: applicationData,
          otp: generatedOTP,
          applicationId,
          expiresAt: expiresAt.toISOString()
        }
      });
      
      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      
      setLinkSent(true);
      toast.success("Application link sent to merchant");
    } catch (error) {
      console.error("Error sending to merchant:", error);
      toast.error("Failed to send application to merchant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!form.getValues("merchantEmail") || !form.getValues("merchantName")) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate new OTP
      const newOTP = generateOTP();
      setOtp(newOTP);
      
      // Resend email
      const { error } = await supabase.functions.invoke('send-merchant-email', {
        body: {
          merchantName: form.getValues("merchantName"),
          merchantEmail: form.getValues("merchantEmail"),
          applicationData: applicationData,
          otp: newOTP,
          resend: true
        }
      });
      
      if (error) {
        throw new Error(`Failed to resend email: ${error.message}`);
      }
      
      toast.success("Application link resent to merchant");
    } catch (error) {
      console.error("Error resending to merchant:", error);
      toast.error("Failed to resend application to merchant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setLinkSent(false);
    setOtp("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send to Merchant</DialogTitle>
          <DialogDescription>
            Send a secure link to the merchant to complete this application.
          </DialogDescription>
        </DialogHeader>
        
        {!linkSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="merchantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merchant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="merchantEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merchant Email</FormLabel>
                    <FormControl>
                      <Input placeholder="merchant@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-1">One-time Password</h4>
              <p className="text-xl font-mono tracking-wider text-center py-2">{otp}</p>
              <p className="text-sm text-gray-500">
                This password has been sent to the merchant's email along with the application link.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                The link and OTP will expire in 48 hours. The merchant can use their email and this OTP to access and complete the application.
              </p>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleResendOTP}
                disabled={isSubmitting}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Resend Email
              </Button>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendToMerchantDialog;
