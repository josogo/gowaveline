
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockBanks } from './mockData';
import { BusinessProfileAlert } from './components/BusinessProfileAlert';
import { BankCard } from './components/BankCard';
import { SubmitButton } from './components/SubmitButton';
import { SuccessCard } from './components/SuccessCard';
import { RoutingHeader } from './components/RoutingHeader';
import type { BankRoutingSystemProps } from './types';

const BankRoutingSystem: React.FC<BankRoutingSystemProps> = ({ onBack }) => {
  const [selectedBanks, setSelectedBanks] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const toggleBankSelection = (bankId: number) => {
    setSelectedBanks(prev => 
      prev.includes(bankId) 
        ? prev.filter(id => id !== bankId) 
        : [...prev, bankId]
    );
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    const selectedBankDetails = mockBanks.filter(bank => selectedBanks.includes(bank.id));
    return <SuccessCard selectedBanks={selectedBankDetails} />;
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <RoutingHeader onBack={onBack} />
        <BusinessProfileAlert />

        <div className="space-y-4">
          {mockBanks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              isSelected={selectedBanks.includes(bank.id)}
              onClick={() => toggleBankSelection(bank.id)}
            />
          ))}
          
          <SubmitButton
            selectedBanks={selectedBanks}
            isSubmitting={isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankRoutingSystem;
