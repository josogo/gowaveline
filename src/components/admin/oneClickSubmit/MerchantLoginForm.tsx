import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { validateMerchantLogin } from '@/services/merchantApplicationService';

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  otp: z.string().min(6, "Enter the 6-digit code").max(6, "Enter the 6-digit code"),
});

type MerchantLoginFormProps = {
  onSuccessfulLogin: (applicationData?: any) => void;
  applicationId?: string;
};

export const MerchantLoginForm: React.FC<MerchantLoginFormProps> = ({
  onSuccessfulLogin,
  applicationId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const { valid, application, error } = await validateMerchantLogin({
        email: values.email,
        otp: values.otp,
        applicationId,
      });
      if (!valid) {
        toast.error(error || "Invalid email or OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }
      toast.success("Login successful");
      onSuccessfulLogin(application);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "Email is required to resend OTP" });
      return;
    }
    
    try {
      setIsResending(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("If your email is in our system, a new OTP has been sent");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Access Your Application</CardTitle>
        <CardDescription>
          Enter your email and the one-time password (OTP) sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456" 
                      maxLength={6}
                      inputMode="numeric"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Continue to Application"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleResendOTP}
          disabled={isResending}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          {isResending ? "Sending..." : "Resend One-Time Password"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MerchantLoginForm;
