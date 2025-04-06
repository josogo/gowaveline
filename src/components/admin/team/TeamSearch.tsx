
import React from 'react';
import { Input } from "@/components/ui/input";

interface TeamSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const TeamSearch: React.FC<TeamSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex items-center mb-6">
      <Input
        placeholder="Search team members..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default TeamSearch;
