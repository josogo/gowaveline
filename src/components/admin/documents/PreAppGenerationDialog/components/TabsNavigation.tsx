
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TabsNavigation: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-7 mb-4">
      <TabsTrigger value="structure" className="text-xs md:text-sm">Structure</TabsTrigger>
      <TabsTrigger value="business" className="text-xs md:text-sm">Business</TabsTrigger>
      <TabsTrigger value="principal" className="text-xs md:text-sm">Principal</TabsTrigger>
      <TabsTrigger value="banking" className="text-xs md:text-sm">Banking</TabsTrigger>
      <TabsTrigger value="volume" className="text-xs md:text-sm">Volume</TabsTrigger>
      <TabsTrigger value="policies" className="text-xs md:text-sm">Policies</TabsTrigger>
      <TabsTrigger value="ecommerce" className="text-xs md:text-sm">eCommerce</TabsTrigger>
    </TabsList>
  );
};
