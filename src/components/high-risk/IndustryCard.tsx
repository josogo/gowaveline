
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
      className={`bg-white rounded-lg shadow-lg p-8 border border-gray-100 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#0EA5E9]' : 'hover:shadow-xl'}`}
      onClick={() => onCardClick(industry)}
    >
      <div className="mb-4">
        {industry.icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">{industry.title}</h3>
      
      {isSelected ? (
        <div className="animate-fade-in">
          <p className="text-[#0EA5E9]/80 mb-6">{industry.helpText}</p>
          <Button 
            variant="link" 
            className="text-[#0EA5E9] p-0 font-medium flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/contact');
            }}
          >
            Get a solution <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-[#0EA5E9]/80 mb-6">{industry.description}</p>
          <Button 
            variant="link" 
            className="text-[#0EA5E9] p-0 font-medium flex items-center"
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
