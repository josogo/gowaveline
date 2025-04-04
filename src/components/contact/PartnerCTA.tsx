
import React from 'react';
import { Button } from '@/components/ui/button';

interface PartnerCTAProps {
  onPartnershipClick: () => void;
}

const PartnerCTA: React.FC<PartnerCTAProps> = ({ onPartnershipClick }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg shadow-md p-8 text-white">
      <h3 className="text-xl font-bold mb-4">Partner With Us</h3>
      <p className="mb-6">
        Interested in our partner program? We offer competitive compensation and dedicated support for agents, ISOs, and software partners.
      </p>
      <Button 
        onClick={onPartnershipClick}
        className="w-full bg-transparent border-2 border-white text-white hover:bg-orange-600"
      >
        Learn More About Partnerships
      </Button>
    </div>
  );
};

export default PartnerCTA;
