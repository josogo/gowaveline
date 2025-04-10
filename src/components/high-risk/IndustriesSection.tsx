
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IndustryCard from './IndustryCard';
import { industryData } from './industryData';
import { HighRiskIndustry } from './types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const IndustriesSection = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<HighRiskIndustry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(8);

  // Filter industries based on search query
  const filteredIndustries = searchQuery 
    ? industryData.filter(industry => 
        industry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : industryData;

  const handleIndustryClick = (industry: HighRiskIndustry) => {
    setSelectedIndustry(selectedIndustry?.id === industry.id ? null : industry);
  };

  // Reset visible count when search query changes
  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9] bg-clip-text text-transparent">Industries We Serve</h2>
        
        {/* Search bar */}
        <div className="mb-10 relative max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0EA5E9] h-5 w-5" />
            <Input
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent shadow-sm"
              placeholder="Search industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredIndustries.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-lg text-gray-600 mb-4">No industries found matching your search.</p>
            <Button 
              onClick={() => setSearchQuery('')}
              variant="outline" 
              className="text-[#0EA5E9] border-[#0EA5E9] hover:bg-[#0EA5E9]/10"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIndustries.slice(0, visibleCount).map((industry, index) => (
              <motion.div
                key={industry.id}
                custom={index % 8}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <IndustryCard 
                  industry={industry}
                  isSelected={selectedIndustry?.id === industry.id}
                  onCardClick={handleIndustryClick}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredIndustries.length > visibleCount && (
          <div className="text-center mt-10">
            <Button 
              onClick={() => setVisibleCount(prev => prev + 8)}
              variant="outline" 
              className="border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
            >
              Load More
            </Button>
          </div>
        )}
        
        <div className="mt-16 p-8 bg-gradient-to-r from-[#0EA5E9]/10 to-[#FF9F5A]/5 rounded-2xl text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Don't See Your Industry?</h3>
          <p className="text-[#0EA5E9]/80 mb-6 max-w-2xl mx-auto">
            We work with many other high-risk industries not listed here. If you're struggling to find payment processing for your business, we likely have a solution.
          </p>
          <Button 
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-[#0EA5E9] to-[#FF9F5A] hover:from-[#0EA5E9]/90 hover:to-[#FF9F5A]/90 text-white shadow-md transform transition-transform hover:scale-105"
          >
            Discuss Your Needs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndustriesSection;
