
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
import { sendContactFormNotification } from '@/services/notificationService';

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
      
      // Send email notification using our service
      const success = await sendContactFormNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        inquiryType: data.inquiryType,
        partnerType: data.partnerType,
        message: data.message
      });
      
      if (!success) {
        throw new Error('Failed to send contact form');
      }
      
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
