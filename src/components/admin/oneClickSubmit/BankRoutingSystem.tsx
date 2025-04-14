
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Send, Check, AlertCircle } from 'lucide-react';

interface BankRoutingSystemProps {
  onBack: () => void;
}

const mockBanks = [
  { 
    id: 1, 
    name: 'FirstData Processing', 
    compatibility: 92, 
    notes: 'Preferred for CBD merchants with less than $150k monthly volume',
    apiAvailable: true
  },
  { 
    id: 2, 
    name: 'Elavon Merchant Services', 
    compatibility: 87, 
    notes: 'Good for established businesses with clean processing history',
    apiAvailable: true
  },
  { 
    id: 3, 
    name: 'Wells Fargo Merchant', 
    compatibility: 74, 
    notes: 'Requires minimum 1 year in business, prefers established companies',
    apiAvailable: false
  },
  { 
    id: 4, 
    name: 'Stripe Connect', 
    compatibility: 62, 
    notes: 'Not ideal for high-risk, but may accept given your chargebacks are low',
    apiAvailable: true
  },
  { 
    id: 5, 
    name: 'Chase Payment Processing', 
    compatibility: 55, 
    notes: 'Low match due to industry classification and monthly volume',
    apiAvailable: false
  },
];

export const BankRoutingSystem: React.FC<BankRoutingSystemProps> = ({ onBack }) => {
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-center text-muted-foreground max-w-md mb-6">
              Your merchant application has been successfully routed to {selectedBanks.length} banks.
              You'll receive updates as they review the submission.
            </p>
            <div className="space-y-2 w-full max-w-md mb-6">
              {selectedBanks.map(bankId => {
                const bank = mockBanks.find(b => b.id === bankId);
                return (
                  <div key={bankId} className="flex items-center p-3 border rounded-md">
                    <div className="bg-blue-100 rounded-full p-1 mr-3">
                      <Send className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{bank?.name}</span>
                  </div>
                );
              })}
            </div>
            <Button 
              onClick={() => window.location.href = '/admin/one-click-submit'}
              className="w-full max-w-md"
            >
              Return to Applications
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Application Analysis</h3>
                <p className="text-sm text-blue-700">
                  Your merchant sells CBD products with monthly volume of $120,000.
                  Based on your business profile, processing history, and documentation,
                  here are your most compatible banking options:
                </p>
              </div>
            </div>
          </div>
          
          {mockBanks.map((bank) => (
            <div 
              key={bank.id} 
              className={`border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${
                selectedBanks.includes(bank.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleBankSelection(bank.id)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border ${
                  selectedBanks.includes(bank.id) 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedBanks.includes(bank.id) && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{bank.name}</h3>
                  <p className="text-sm text-muted-foreground">{bank.notes}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold">{bank.compatibility}%</div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  bank.apiAvailable ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bank.apiAvailable ? 'API Ready' : 'PDF Form'}
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={selectedBanks.length === 0 || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit to {selectedBanks.length} Banks
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankRoutingSystem;
