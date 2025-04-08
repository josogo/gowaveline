
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ContactType } from '../types';

interface TypeBadgeProps {
  type: ContactType;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const getTypeColor = (type: ContactType) => {
    switch (type) {
      case 'lead': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
      case 'partner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vendor': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={getTypeColor(type)}>
      {type}
    </Badge>
  );
};
