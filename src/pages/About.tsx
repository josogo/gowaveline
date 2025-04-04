
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#0EA5E9]">Why Waveline Exists</h1>
            
            <div className="prose prose-lg mx-auto text-[#0EA5E9] space-y-6">
              <p className="text-xl">
                After spending 16 years in the payment processing industry, we saw a problem: as big corporations bought out smaller processors, businesses lost transparency, flexibility, and personalized service.
              </p>
              
              <p className="text-xl">
                Waveline was founded to be different. We're a boutique payment provider that acts as an extension of your business—not just a vendor. Our approach is nimble, innovative, and built on trust.
              </p>
              
              <p className="text-xl">
                We specialize in industries that traditional processors overlook, offering creative solutions tailored to your unique needs. Our goal is simple: to get deals done that others can't.
              </p>
              
              <p className="text-xl">
                At Waveline, you're not just another merchant account. You're a partner. Let's ride this wave and grow together.
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#0EA5E9]">Contact Us</h2>
            
            <div className="flex flex-col items-center justify-center space-y-4">
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
      </main>
      <Footer />
    </div>
  );
};

export default About;
