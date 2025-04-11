
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { fetchIndustries } from '../../api';

interface Industry {
  id: string;
  name: string;
  description?: string;
}

interface IndustrySelectorProps {
  selectedIndustryId: string;
  setSelectedIndustryId: (id: string) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ 
  selectedIndustryId, 
  setSelectedIndustryId 
}) => {
  const { data: industries, isLoading: industriesLoading } = useQuery<Industry[]>({
    queryKey: ['industries'],
    queryFn: fetchIndustries,
  });

  return (
    <div className="mb-4">
      <Label htmlFor="industry" className="block font-medium mb-1">Select Industry</Label>
      <Select value={selectedIndustryId} onValueChange={setSelectedIndustryId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an industry" />
        </SelectTrigger>
        <SelectContent>
          {industriesLoading ? (
            <SelectItem value="loading" disabled>Loading industries...</SelectItem>
          ) : industries && industries.length > 0 ? (
            industries.map((industry) => (
              <SelectItem key={industry.id} value={industry.id}>
                {industry.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No industries available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
