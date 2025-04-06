
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IndustryCard from './IndustryCard';
import { industryData } from './industryData';
import { HighRiskIndustry } from './types';

const IndustriesSection = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<HighRiskIndustry | null>(null);

  const handleIndustryClick = (industry: HighRiskIndustry) => {
    setSelectedIndustry(selectedIndustry?.id === industry.id ? null : industry);
  };

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#0EA5E9]">Industries We Serve</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industryData.map((industry) => (
            <IndustryCard 
              key={industry.id}
              industry={industry}
              isSelected={selectedIndustry?.id === industry.id}
              onCardClick={handleIndustryClick}
            />
          ))}
        </div>
        
        <div className="mt-16 p-8 bg-gradient-to-r from-[#0EA5E9]/10 to-[#0EA5E9]/5 rounded-xl text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Don't See Your Industry?</h3>
          <p className="text-[#0EA5E9] mb-6 max-w-2xl mx-auto">
            We work with many other high-risk industries not listed here. If you're struggling to find payment processing for your business, we likely have a solution.
          </p>
          <Button 
            onClick={() => navigate('/contact')}
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
          >
            Discuss Your Needs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndustriesSection;
