
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { 
  formSchema, 
  ContactFormValues,
  NameEmailFields,
  PhoneCompanyFields,
  InquiryFields,
  MessageField,
  SubmitButton 
} from './form';

interface ContactFormProps {
  initialInquiryType?: string;
  initialPartnerType?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ initialInquiryType, initialPartnerType }) => {
  const [isPartner, setIsPartner] = useState(initialInquiryType === 'partnership');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      inquiryType: initialInquiryType || 'general',
      partnerType: initialPartnerType || '',
      message: '',
    },
  });
  
  useEffect(() => {
    if (initialInquiryType) {
      form.setValue('inquiryType', initialInquiryType);
    }
    
    if (initialPartnerType) {
      form.setValue('partnerType', initialPartnerType);
      setIsPartner(true);
    }
  }, [initialInquiryType, initialPartnerType, form]);
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Form submitted:', data);
      
      // Send email notification using our edge function
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          subject: `New Contact Form: ${data.inquiryType.toUpperCase()}`,
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            message: data.message,
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Email sending failed:', errorData);
        throw new Error(errorData.error?.message || 'Failed to send email');
      }
      
      const result = await response.json();
      
      toast.success('Your message has been sent! We\'ll be in touch soon.');
      form.reset();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error?.message || 'There was a problem sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInquiryTypeChange = (value: string) => {
    setIsPartner(value === 'partnership');
    if (value !== 'partnership') {
      form.setValue('partnerType', '');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Send Us a Message</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <NameEmailFields form={form} />
          <PhoneCompanyFields form={form} />
          <InquiryFields 
            form={form} 
            isPartner={isPartner} 
            onInquiryTypeChange={handleInquiryTypeChange} 
          />
          <MessageField form={form} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
