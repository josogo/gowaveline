
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { mockBanks } from './mockData';
import { BusinessProfileAlert } from './components/BusinessProfileAlert';
import { BankCard } from './components/BankCard';
import { SubmitButton } from './components/SubmitButton';
import { SuccessCard } from './components/SuccessCard';
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
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI Bank Routing Engine</h2>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Application
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">
            Select the banks you'd like to submit this application to
          </p>
        </div>

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
