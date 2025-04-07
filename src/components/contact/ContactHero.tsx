
import React from 'react';
import AnimatedText from '@/components/AnimatedText';

const ContactHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <AnimatedText type="slide" direction="up" className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
          <h1>Contact Us</h1>
        </AnimatedText>
        <AnimatedText type="fade" delay={300}>
          <p className="text-xl text-[#0EA5E9] max-w-3xl mx-auto">
            Have questions about our services? Need a personalized quote? Want to join our partner network? We're here to help!
          </p>
        </AnimatedText>
      </div>
    </section>
  );
};

export default ContactHero;
