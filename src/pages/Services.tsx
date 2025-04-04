
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShoppingCart, 
  Terminal, 
  Globe, 
  ShieldAlert, 
  BarChart4, 
  Bitcoin
} from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "E-Commerce Payments",
      description: "Break away from Stripe, Square, and Shopify with our tailored e-commerce payment solutions designed for your specific business needs.",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-400"
    },
    {
      title: "POS Payments",
      description: "Seamless point-of-sale solutions that integrate with your existing systems or provide complete new setups for in-person transactions.",
      icon: Terminal,
      color: "from-teal-500 to-teal-400"
    },
    {
      title: "Global Banking",
      description: "Expand your business internationally with our comprehensive global banking solutions, including multi-currency support.",
      icon: Globe,
      color: "from-green-500 to-green-400"
    },
    {
      title: "High Risk Credit Card Processing",
      description: "Specialized payment processing for high-risk industries that traditional processors typically avoid or charge excessive rates for.",
      icon: ShieldAlert,
      color: "from-orange-500 to-orange-400"
    },
    {
      title: "Cashless ATMs",
      description: "Innovative solutions for businesses that need alternatives to traditional payment processing methods.",
      icon: CreditCard,
      color: "from-purple-500 to-purple-400"
    },
    {
      title: "Crypto Solutions",
      description: "Embrace the future of payments with our cryptocurrency payment processing and integration services.",
      icon: Bitcoin,
      color: "from-yellow-500 to-yellow-400"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0EA5E9]">Our Services</h1>
            <p className="text-xl text-[#0EA5E9] max-w-3xl mx-auto mb-12">
              Waveline offers innovative payment solutions tailored to your business needs, 
              with a focus on industries overlooked by traditional processors.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-lg p-8 transition-transform hover:transform hover:scale-105"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r ${service.color}`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-[#0EA5E9]">{service.title}</h3>
                  <p className="text-[#0EA5E9] mb-6">{service.description}</p>
                  <Button 
                    onClick={() => navigate('/get-started')}
                    variant="outline" 
                    className="w-full border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
                  >
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <Button 
                onClick={() => navigate('/get-started')}
                className="px-8 py-6 text-lg bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
