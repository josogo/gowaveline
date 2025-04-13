
import React from 'react';

const ContactHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-transparent py-10 sm:py-16 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-4 sm:mb-6">
          Contact Us
        </h1>
        <p className="text-lg sm:text-xl text-[#0EA5E9] max-w-3xl mx-auto">
          Have questions about our services? Need a personalized quote? Want to join our partner network? We're here to help!
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
