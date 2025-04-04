
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav className={cn("w-full py-4 px-6 flex items-center justify-between bg-background/80 backdrop-blur-sm z-10 sticky top-0", className)}>
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-500 to-teal-500"></div>
        <span className="font-bold text-xl">Gowaveline</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Button variant="link">Home</Button>
        <Button variant="link">About</Button>
        <Button variant="link">Features</Button>
        <Button variant="link">Contact</Button>
      </div>
      
      <div>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white rounded-md">
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
