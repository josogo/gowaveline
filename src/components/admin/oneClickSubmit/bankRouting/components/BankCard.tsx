
import { Check } from 'lucide-react';
import type { Bank } from '../types';

interface BankCardProps {
  bank: Bank;
  isSelected: boolean;
  onClick: () => void;
}

export const BankCard = ({ bank, isSelected, onClick }: BankCardProps) => {
  return (
    <div 
      className={`border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border ${
          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
          {isSelected && <Check className="h-4 w-4 text-white" />}
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
  );
};
