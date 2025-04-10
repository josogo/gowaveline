
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
      className={`bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-300 cursor-pointer h-full flex flex-col transform hover:-translate-y-1 hover:shadow-xl
        ${isSelected ? 'ring-2 ring-[#0EA5E9] shadow-lg' : ''}
      `}
      onClick={() => onCardClick(industry)}
    >
      <div className="mb-4 transition-transform duration-300 hover:scale-110">
        {/* Properly handle icon rendering based on whether it's a React element or something else */}
        {React.isValidElement(industry.icon) ? (
          // For React elements (like Lucide icons), we can safely clone and add className
          React.cloneElement(industry.icon as React.ReactElement, {
            className: `h-12 w-12 ${isSelected ? 'text-[#0EA5E9] drop-shadow-[0_0_3px_rgba(14,165,233,0.5)]' : 'text-[#FF9F5A]'}`
          })
        ) : (
          // For non-React element icons (like strings or other content)
          <div className={`h-12 w-12 ${isSelected ? 'text-[#0EA5E9]' : 'text-[#FF9F5A]'}`}>
            {industry.icon}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-[#0EA5E9] transition-colors duration-300">{industry.title}</h3>
      
      {isSelected ? (
        <div className="animate-fade-in flex-grow">
          <p className="text-sm text-[#0EA5E9]/80 mb-4 leading-relaxed">{industry.helpText}</p>
          <Button 
            variant="link" 
            className="text-[#FF9F5A] p-0 font-medium flex items-center mt-auto transition-all duration-300 group"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/contact');
            }}
          >
            Get a solution <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <p className="text-sm text-[#0EA5E9]/80 mb-4 leading-relaxed">{industry.description}</p>
          <Button 
            variant="link" 
            className="text-[#FF9F5A] p-0 font-medium flex items-center mt-auto transition-all duration-300 group"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(industry);
            }}
          >
            How we can help <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default IndustryCard;
