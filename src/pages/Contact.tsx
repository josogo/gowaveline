
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContactForm, ContactInfo, PartnerCTA, ContactHero } from '@/components/contact';

const Contact = () => {
  const location = useLocation();
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1">
        <ContactHero />
        
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2" ref={formRef}>
              <ContactForm 
                initialInquiryType={location.state?.partnerType ? 'partnership' : undefined}
                initialPartnerType={location.state?.partnerType}
              />
            </div>
            
            <div>
              <ContactInfo />
              <PartnerCTA onPartnershipClick={() => {
                scrollToForm();
                // We don't need to use form.setValue here as it's now handled in the ContactForm component
                // through the initialInquiryType and initialPartnerType props
              }} />
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
