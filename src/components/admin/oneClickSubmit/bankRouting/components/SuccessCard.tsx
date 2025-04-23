
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import type { Bank } from '../types';

interface SuccessCardProps {
  selectedBanks: Bank[];
}

export const SuccessCard = ({ selectedBanks }: SuccessCardProps) => {
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
            {selectedBanks.map(bank => (
              <div key={bank.id} className="flex items-center p-3 border rounded-md">
                <div className="bg-blue-100 rounded-full p-1 mr-3">
                  <Send className="h-4 w-4 text-blue-600" />
                </div>
                <span>{bank.name}</span>
              </div>
            ))}
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
};
