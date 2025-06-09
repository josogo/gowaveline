
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { HandshakeIcon, Users, LightbulbIcon, BarChart3, Shield, Gem } from 'lucide-react';

const Partners = () => {
  const navigate = useNavigate();

  const handleContactClick = (partnerType: string) => {
    navigate('/contact', { state: { partnerType } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 to-transparent py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 animate-fade-in">
              Strategic Partnerships
            </h1>
            <p className="text-xl md:text-2xl text-[#0EA5E9] max-w-3xl mx-auto mb-8">
              Join forces with Waveline to create mutual growth opportunities and deliver exceptional payment solutions.
            </p>
            <Button 
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-6 text-lg rounded-md"
            >
              Become a Partner Today
            </Button>
          </div>
        </section>
        
        {/* Partnership Philosophy */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-orange-500 mb-6">Our Partnership Philosophy</h2>
                <p className="text-[#0EA5E9] text-lg mb-6">
                  At Waveline, we pride ourselves on building strong, lasting partnerships. Our approach is centered around creating sustainable, mutually beneficial relationships rather than pursuing quick profits.
                </p>
                <p className="text-[#0EA5E9] text-lg mb-6">
                  We invest in our partners' success through comprehensive training, marketing support, competitive compensation, and dedicated relationship management.
                </p>
                <div className="flex items-center space-x-4 mt-8">
                  <HandshakeIcon className="h-12 w-12 text-orange-500" />
                  <p className="text-[#0EA5E9] text-lg font-medium">Long-term relationships over short-term gains</p>
                </div>
              </div>
              <div className="glass-card p-8 md:p-10">
                <h3 className="text-2xl font-bold text-orange-500 mb-6 text-center">Why Partner With Us</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Gem className="h-6 w-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="text-xl font-medium text-orange-500">Competitive Compensation</h4>
                      <p className="text-[#0EA5E9]">Industry-leading revenue sharing and residual income opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="text-xl font-medium text-orange-500">Merchant Protection</h4>
                      <p className="text-[#0EA5E9]">Transparent pricing and business practices to protect your clients</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <BarChart3 className="h-6 w-6 text-orange-500 mt-1" />
                    <div>
                      <h4 className="text-xl font-medium text-orange-500">Growth Resources</h4>
                      <p className="text-[#0EA5E9]">Tools, training, and resources designed to accelerate your business</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Partnership Types */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-transparent to-orange-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-orange-500 mb-4 text-center">Partnership Opportunities</h2>
            <p className="text-[#0EA5E9] text-xl mb-12 text-center max-w-3xl mx-auto">
              We offer various partnership models tailored to your business needs and goals
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Agent Partnerships */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6">
                  <Users className="h-12 w-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white">Agent Partnerships</h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[#0EA5E9]">
                    Ideal for sales professionals looking to offer payment processing solutions to their clients. Benefit from our competitive commission structure and comprehensive sales support.
                  </p>
                  <ul className="space-y-2 text-[#0EA5E9]">
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Industry-leading residual splits
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Sales and marketing resources
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Dedicated relationship manager
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Training and certification
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleContactClick('agent')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Become an Agent
                  </Button>
                </div>
              </div>
              
              {/* ISO Partnerships */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6">
                  <BarChart3 className="h-12 w-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white">ISO Partnerships</h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[#0EA5E9]">
                    For established Independent Sales Organizations looking to expand their offerings. We provide the technology, support, and flexibility to help you scale.
                  </p>
                  <ul className="space-y-2 text-[#0EA5E9]">
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Custom pricing programs
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      White-label solutions
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Sub-ISO opportunities
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Portfolio management tools
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleContactClick('iso')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Partner as an ISO
                  </Button>
                </div>
              </div>
              
              {/* ISV Partnerships */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6">
                  <LightbulbIcon className="h-12 w-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white">ISV Partnerships</h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[#0EA5E9]">
                    For software vendors looking to integrate payment solutions. Our developer-friendly APIs and revenue-sharing models create a seamless experience.
                  </p>
                  <ul className="space-y-2 text-[#0EA5E9]">
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Flexible API integration
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Developer support
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Revenue share models
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-orange-500">•</span> 
                      Technical documentation
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleContactClick('isv')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Partner as an ISV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-orange-500 mb-12 text-center">What Our Partners Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-orange-100 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-xl mr-4">
                    JS
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-500">John Smith</h4>
                    <p className="text-sm text-[#0EA5E9]">Independent Agent</p>
                  </div>
                </div>
                <p className="text-[#0EA5E9]">
                  "The support team at Waveline is exceptional. They're always available to help me close deals and provide the resources I need to succeed."
                </p>
              </div>
              
              <div className="bg-white border border-orange-100 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-xl mr-4">
                    AB
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-500">Amanda Brown</h4>
                    <p className="text-sm text-[#0EA5E9]">ISO Manager</p>
                  </div>
                </div>
                <p className="text-[#0EA5E9]">
                  "The transparency and competitive pricing structure have helped us grow our portfolio significantly. Our merchants are happier, and our residuals have increased."
                </p>
              </div>
              
              <div className="bg-white border border-orange-100 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-xl mr-4">
                    MT
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-500">Michael Thomas</h4>
                    <p className="text-sm text-[#0EA5E9]">Software Integration Partner</p>
                  </div>
                </div>
                <p className="text-[#0EA5E9]">
                  "Integrating Waveline's payment solution into our POS system was straightforward. Their developer documentation and support made the process seamless."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-orange-500 to-orange-400">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Together?</h2>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Join our partner network today and discover how we can help you increase revenue while providing exceptional payment solutions to your clients.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-6 text-lg rounded-md"
              >
                Contact Our Partnership Team
              </Button>
              <Button 
                onClick={() => navigate('/partnership-guide')}
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange-500 px-8 py-6 text-lg rounded-md"
              >
                Download Partnership Guide
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Partners;
