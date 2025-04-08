
import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-10 border rounded-md bg-gray-50">
      <p className="text-gray-500">No contacts found</p>
      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new contact</p>
    </div>
  );
};
