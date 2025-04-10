
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HighRiskIndustry } from './types';

interface IndustryCardProps {
  industry: HighRiskIndustry;
  isSelected: boolean;
  onCardClick: (industry: HighRiskIndustry) => void;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry, isSelected, onCardClick }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-all cursor-pointer h-full flex flex-col ${isSelected ? 'ring-2 ring-[#0EA5E9]' : 'hover:shadow-lg'}`}
      onClick={() => onCardClick(industry)}
    >
      <div className="mb-3">
        {industry.icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[#0EA5E9]">{industry.title}</h3>
      
      {isSelected ? (
        <div className="animate-fade-in flex-grow">
          <p className="text-sm text-[#0EA5E9]/80 mb-4">{industry.helpText}</p>
          <Button 
            variant="link" 
            className="text-[#0EA5E9] p-0 font-medium flex items-center mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/contact');
            }}
          >
            Get a solution <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <p className="text-sm text-[#0EA5E9]/80 mb-4">{industry.description}</p>
          <Button 
            variant="link" 
            className="text-[#0EA5E9] p-0 font-medium flex items-center mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(industry);
            }}
          >
            How we can help <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default IndustryCard;
