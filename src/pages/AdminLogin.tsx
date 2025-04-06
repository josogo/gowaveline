
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LockKeyhole, User } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call to authenticate
      console.log('Login attempt with:', values);
      
      // For demonstration purposes, we'll use a mock login
      if (values.email === 'admin@gowaveline.com' && values.password === 'password123') {
        // Store auth info in localStorage (in a real app, use more secure methods)
        localStorage.setItem('adminToken', 'demo-token-123');
        localStorage.setItem('adminUser', JSON.stringify({
          id: '1',
          email: values.email,
          name: 'Admin User',
          role: 'admin'
        }));
        
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-transparent p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img 
            src="/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png" 
            alt="Waveline Logo" 
            className="h-16 mx-auto mb-6"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
          <h1 className="text-2xl font-bold text-[#0EA5E9]">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          className="pl-10" 
                          autoComplete="email"
                          type="email"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10" 
                          autoComplete="current-password"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9]"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              className="text-sm text-gray-600"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>For demonstration purposes:</p>
          <p>Email: admin@gowaveline.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
