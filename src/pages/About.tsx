
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, Users, Shield, TrendingUp, Zap, Compass, Award, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0EA5E9]">Our Mission</h1>
                <p className="text-xl text-[#0EA5E9] leading-relaxed">
                  To provide transparent, flexible, and personalized payment processing solutions that empower businesses to grow without limitations.
                </p>
                <div className="mt-8">
                  <Button 
                    onClick={() => navigate('/contact')}
                    className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white"
                  >
                    Get in Touch
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/lovable-uploads/2d9abfe8-af53-43b1-9ce4-d5c73518ff44.png" 
                  alt="Waveline Logo" 
                  className="h-64 w-auto mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Story */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#0EA5E9]">The Waveline Story</h2>
            
            <div className="prose prose-lg mx-auto text-[#0EA5E9] space-y-6">
              <p className="text-xl leading-relaxed">
                After spending 16 years in the payment processing industry, we saw a troubling trend: as big corporations bought out smaller processors, businesses lost transparency, flexibility, and personalized service.
              </p>
              
              <p className="text-xl leading-relaxed">
                The payment processing landscape had become dominated by faceless corporations with rigid policies, hidden fees, and one-size-fits-all solutions. Businesses were treated as mere numbers, with little regard for their unique needs and challenges.
              </p>
              
              <p className="text-xl leading-relaxed">
                We founded Waveline to be fundamentally different. We're a boutique payment provider built around relationships. We believe that understanding your business is the first step in providing effective payment solutions.
              </p>
              
              <p className="text-xl leading-relaxed">
                Our approach is nimble, innovative, and built on trust. We don't hide behind complex rate structures or pages of fine print. Instead, we provide straightforward solutions with transparent pricing and exceptional service.
              </p>
              
              <p className="text-xl leading-relaxed">
                We specialize in industries that traditional processors overlook or avoid, offering creative solutions tailored to your unique needs. Our goal is simple: to get deals done that others can't.
              </p>
              
              <p className="text-xl leading-relaxed">
                At Waveline, you're not just another merchant account. You're a partner. We succeed when you succeed. Let's ride this wave and grow together.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#0EA5E9]">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 bg-[#0EA5E9]/10 p-3 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Transparency</h3>
                <p className="text-[#0EA5E9]/80">
                  We believe in clear, straightforward communication. No hidden fees, no confusing terms, just honest solutions.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 bg-[#0EA5E9]/10 p-3 rounded-full w-fit">
                  <Users className="h-8 w-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Partnership</h3>
                <p className="text-[#0EA5E9]/80">
                  We see ourselves as an extension of your business, deeply invested in your success and growth.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 bg-[#0EA5E9]/10 p-3 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Innovation</h3>
                <p className="text-[#0EA5E9]/80">
                  We constantly explore new solutions and technologies to solve complex payment challenges.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 bg-[#0EA5E9]/10 p-3 rounded-full w-fit">
                  <TrendingUp className="h-8 w-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Adaptability</h3>
                <p className="text-[#0EA5E9]/80">
                  We pride ourselves on being flexible and responsive to changing business needs and market conditions.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 bg-[#0EA5E9]/10 p-3 rounded-full w-fit">
                  <Compass className="h-8 w-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Expertise</h3>
                <p className="text-[#0EA5E9]/80">
                  With decades of combined experience, we provide knowledgeable guidance through the complex payment landscape.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4 bg-[#0EA5E9]/10 p-3 rounded-full w-fit">
                  <Award className="h-8 w-8 text-[#0EA5E9]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Integrity</h3>
                <p className="text-[#0EA5E9]/80">
                  We do what we say we'll do, operating with honesty and ethical principles in all our relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Approach */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center text-[#0EA5E9]">The Waveline Approach</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-[#0EA5E9]/10 p-6 rounded-full">
                    <Target className="h-16 w-16 text-[#0EA5E9]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-4 text-[#0EA5E9]">Personalized Solutions</h3>
                  <p className="text-[#0EA5E9]/80 text-lg">
                    We don't believe in one-size-fits-all. We take the time to understand your business model, industry challenges, and specific needs. Then we craft tailored processing solutions that align with your goals and growth trajectory.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 md:order-last flex justify-center">
                  <div className="bg-[#0EA5E9]/10 p-6 rounded-full">
                    <Shield className="h-16 w-16 text-[#0EA5E9]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-4 text-[#0EA5E9]">Risk Management Expertise</h3>
                  <p className="text-[#0EA5E9]/80 text-lg">
                    Where others see obstacles, we see opportunities. Our deep understanding of risk management allows us to serve industries and business models that conventional processors turn away. We help you navigate complex compliance requirements while minimizing processing disruptions.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-[#0EA5E9]/10 p-6 rounded-full">
                    <Clock className="h-16 w-16 text-[#0EA5E9]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-4 text-[#0EA5E9]">Responsive Support</h3>
                  <p className="text-[#0EA5E9]/80 text-lg">
                    When you have questions or concerns, you deserve immediate attention. Our dedicated support team is readily available to address your needs promptly. We're committed to providing responsive, knowledgeable assistance whenever you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="py-16 px-6 bg-gradient-to-b from-orange-50 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-[#0EA5E9]">Get in Touch</h2>
            <p className="text-xl text-[#0EA5E9] mb-10">
              Ready to experience payment processing designed around your business? We'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
              <div className="flex items-center text-[#0EA5E9]">
                <Mail className="mr-2 h-5 w-5" />
                <a href="mailto:info@gowaveline.com" className="text-xl hover:underline">info@gowaveline.com</a>
              </div>
              
              <div className="flex items-center text-[#0EA5E9]">
                <Phone className="mr-2 h-5 w-5" />
                <a href="tel:8055863591" className="text-xl hover:underline">(805) 586-3591</a>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white px-8 py-3 text-lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
