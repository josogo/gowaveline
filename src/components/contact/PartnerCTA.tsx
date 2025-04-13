
import React from 'react';
import { Button } from '@/components/ui/button';

interface PartnerCTAProps {
  onPartnershipClick: () => void;
  className?: string;
}

const PartnerCTA: React.FC<PartnerCTAProps> = ({ 
  onPartnershipClick, 
  className = '' 
}) => {
  return (
    <div className={`bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg shadow-md p-4 sm:p-8 text-white ${className}`}>
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Partner With Us</h3>
      <p className="mb-4 sm:mb-6 text-sm sm:text-base">
        Interested in our partner program? We offer competitive compensation and dedicated support for agents, ISOs, and software partners.
      </p>
      <Button 
        onClick={onPartnershipClick}
        className="w-full bg-transparent border-2 border-white text-white hover:bg-orange-600 py-2 sm:py-3"
      >
        Learn More About Partnerships
      </Button>
    </div>
  );
};

export default PartnerCTA;
