
import React from 'react';

export const TitleSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Contact Management</h1>
        <p className="text-muted-foreground mt-1">Manage your contacts and leads</p>
      </div>
    </div>
  );
};

export default TitleSection;
