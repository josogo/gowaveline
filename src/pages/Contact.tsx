
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, Send, MapPin, Clock, Globe } from 'lucide-react';
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
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0EA5E9]">Get in Touch</h1>
            <p className="text-xl text-[#0EA5E9] mb-8 max-w-2xl mx-auto">
              Have questions about payment processing? Looking for a better solution? We're here to help you navigate the complex world of payments.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="flex items-center text-[#0EA5E9] group">
                <div className="bg-[#0EA5E9]/10 p-3 rounded-full mr-3 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <a href="mailto:info@gowaveline.com" className="text-xl hover:underline">info@gowaveline.com</a>
              </div>
              
              <div className="flex items-center text-[#0EA5E9] group">
                <div className="bg-[#0EA5E9]/10 p-3 rounded-full mr-3 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <a href="tel:8055863591" className="text-xl hover:underline">(805) 586-3591</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form and Info */}
        <div className="py-12 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Form */}
              <div className="lg:w-2/3">
                <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-[#0EA5E9]">Send Us a Message</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#0EA5E9]">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" className="border-[#0EA5E9]/20 focus-visible:ring-[#0EA5E9]" {...field} />
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
                                <Input type="email" placeholder="your@email.com" className="border-[#0EA5E9]/20 focus-visible:ring-[#0EA5E9]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#0EA5E9]">Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" className="border-[#0EA5E9]/20 focus-visible:ring-[#0EA5E9]" {...field} />
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
                                <Input placeholder="Your business" className="border-[#0EA5E9]/20 focus-visible:ring-[#0EA5E9]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0EA5E9]">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[150px] resize-y border-[#0EA5E9]/20 focus-visible:ring-[#0EA5E9]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white py-6 text-lg"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="lg:w-1/3">
                <div className="bg-[#0EA5E9]/5 rounded-xl p-8 h-full">
                  <h3 className="text-xl font-bold mb-6 text-[#0EA5E9]">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-[#0EA5E9]/10 p-2 rounded-full mr-4 mt-1">
                        <Mail className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0EA5E9]">Email Us</h4>
                        <a href="mailto:info@gowaveline.com" className="text-[#0EA5E9]/80 hover:text-[#0EA5E9]">
                          info@gowaveline.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#0EA5E9]/10 p-2 rounded-full mr-4 mt-1">
                        <Phone className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0EA5E9]">Call Us</h4>
                        <a href="tel:8055863591" className="text-[#0EA5E9]/80 hover:text-[#0EA5E9]">
                          (805) 586-3591
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#0EA5E9]/10 p-2 rounded-full mr-4 mt-1">
                        <MapPin className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0EA5E9]">Office</h4>
                        <p className="text-[#0EA5E9]/80">
                          California, United States
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#0EA5E9]/10 p-2 rounded-full mr-4 mt-1">
                        <Clock className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0EA5E9]">Business Hours</h4>
                        <p className="text-[#0EA5E9]/80">
                          Monday - Friday: 9AM - 5PM PST
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#0EA5E9]/10 p-2 rounded-full mr-4 mt-1">
                        <Globe className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0EA5E9]">Service Areas</h4>
                        <p className="text-[#0EA5E9]/80">
                          United States, Canada, Europe, and Global Processing Solutions
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-[#0EA5E9] rounded-lg text-white">
                    <h4 className="font-semibold mb-2">Need Immediate Assistance?</h4>
                    <p className="mb-4 text-white/90">
                      For urgent matters, please call us directly for the fastest response.
                    </p>
                    <a 
                      href="tel:8055863591" 
                      className="inline-block bg-white text-[#0EA5E9] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-10 text-[#0EA5E9]">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-[#0EA5E9]">How quickly can you set up a merchant account?</h3>
                <p className="text-[#0EA5E9]/80">
                  For standard businesses, we can typically have you processing in 1-3 business days. High-risk businesses may take 5-7 days, depending on your industry and specific circumstances.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-[#0EA5E9]">Do you work with high-risk industries?</h3>
                <p className="text-[#0EA5E9]/80">
                  Yes! We specialize in providing payment processing for businesses considered high-risk by traditional processors. Contact us to discuss your specific industry needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-[#0EA5E9]">What information do I need to apply?</h3>
                <p className="text-[#0EA5E9]/80">
                  You'll need basic business information, processing history (if available), and identification documents. We'll guide you through the exact requirements based on your business type.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-[#0EA5E9]">Can you help lower my current processing rates?</h3>
                <p className="text-[#0EA5E9]/80">
                  In most cases, yes! Upload your current statement for a free analysis, and we'll show you exactly how much you could save by switching to Waveline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
