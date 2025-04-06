
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BenefitsSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#0EA5E9]">Why Choose Waveline for High-Risk Processing?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 text-left">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Industry Expertise</h3>
            <p className="text-[#0EA5E9]/80">
              Our team has decades of combined experience working with businesses in high-risk verticals. We understand your unique challenges.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Multiple Banking Relationships</h3>
            <p className="text-[#0EA5E9]/80">
              We maintain strong partnerships with domestic and offshore banks that specialize in high-risk merchant accounts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Competitive Rates</h3>
            <p className="text-[#0EA5E9]/80">
              We work to secure the most favorable terms possible, even for businesses in challenging industries.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Chargeback Protection</h3>
            <p className="text-[#0EA5E9]/80">
              Our solutions include advanced fraud detection and chargeback mitigation tools specifically designed for high-risk businesses.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white"
          >
            Analyze Your Statement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
