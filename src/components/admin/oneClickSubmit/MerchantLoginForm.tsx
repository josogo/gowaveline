
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  otp: z.string().min(6, 'Please enter the 6-digit code'),
});

type MerchantLoginFormProps = {
  onSuccessfulLogin: (applicationData: any) => void;
  applicationId?: string;
};

export const MerchantLoginForm = ({ onSuccessfulLogin, applicationId }: MerchantLoginFormProps) => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      // Verify the email and OTP against the database
      const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('merchant_email', values.email)
        .eq('otp', values.otp)
        .eq('id', applicationId)
        .single();

      if (error) {
        throw error;
      }

      // If successful, call the onSuccessfulLogin callback with the data
      toast.success('Authentication successful!');
      onSuccessfulLogin(data);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to authenticate. Please check your email and code.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business email" type="email" {...field} />
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
              <FormLabel>Authentication Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your 6-digit code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Authenticating...' : 'Continue Application'}
        </Button>
      </form>
    </Form>
  );
};
