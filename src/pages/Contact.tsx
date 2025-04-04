
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  business: z.string().min(2, { message: 'Business name is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      business: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log('Form data submitted:', data);
    
    // Here you would typically send the data to your backend
    // For now, just showing a success toast
    toast.success('Your message has been sent!', {
      description: 'We will get back to you as soon as possible.',
    });
    
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0EA5E9]">Contact Us</h1>
            <p className="text-xl text-[#0EA5E9] mb-8">
              We'd love to hear from you. Reach out today to learn how we can help your business.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="flex items-center text-[#0EA5E9]">
                <Mail className="mr-2 h-5 w-5" />
                <a href="mailto:info@gowaveline.com" className="text-xl hover:underline">info@gowaveline.com</a>
              </div>
              
              <div className="flex items-center text-[#0EA5E9]">
                <Phone className="mr-2 h-5 w-5" />
                <a href="tel:8055863591" className="text-xl hover:underline">(805) 586-3591</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-12 px-6 bg-white">
          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#0EA5E9]">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0EA5E9]">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0EA5E9]">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0EA5E9]">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0EA5E9]">Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0EA5E9]">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[120px] resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
