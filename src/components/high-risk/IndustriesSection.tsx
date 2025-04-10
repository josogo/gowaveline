
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IndustryCard from './IndustryCard';
import { industryData } from './industryData';
import { HighRiskIndustry } from './types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const IndustriesSection = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<HighRiskIndustry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleIndustryClick = (industry: HighRiskIndustry) => {
    setSelectedIndustry(selectedIndustry?.id === industry.id ? null : industry);
  };

  // Filter industries based on search query
  const filteredIndustries = searchQuery 
    ? industryData.filter(industry => 
        industry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : industryData;

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#0EA5E9]">Industries We Serve</h2>
        
        {/* Search bar */}
        <div className="mb-8 relative max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              placeholder="Search industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredIndustries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No industries found matching your search.</p>
            <Button 
              onClick={() => setSearchQuery('')}
              variant="link" 
              className="text-[#0EA5E9] mt-2"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIndustries.map((industry) => (
              <IndustryCard 
                key={industry.id}
                industry={industry}
                isSelected={selectedIndustry?.id === industry.id}
                onCardClick={handleIndustryClick}
              />
            ))}
          </div>
        )}
        
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
