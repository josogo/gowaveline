
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface DealCardFooterProps {
  onClose: () => void;
}

const DealCardFooter: React.FC<DealCardFooterProps> = ({ onClose }) => {
  return (
    <CardFooter className="border-t p-4 mt-auto flex justify-end bg-gray-50">
      <Button variant="outline" onClick={onClose}>Close</Button>
    </CardFooter>
  );
};

export default DealCardFooter;
