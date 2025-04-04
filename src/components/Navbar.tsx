
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  const navItems = [
    { label: 'Industries', path: '/industries' },
    { label: 'Services', path: '/services' },
    { label: 'Partners', path: '/partners' },
    { label: 'High Risk', path: '/high-risk' },
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn("w-full py-4 px-6 flex items-center justify-between bg-background/80 backdrop-blur-sm z-10 sticky top-0", className)}>
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/2d9abfe8-af53-43b1-9ce4-d5c73518ff44.png" 
          alt="Logo" 
          className="h-10 w-auto"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Button 
            key={item.path} 
            variant="link" 
            className="text-[#0EA5E9]" 
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-[#0EA5E9]" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Button 
                  key={item.path} 
                  variant="ghost" 
                  className="justify-start text-[#0EA5E9]" 
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="hidden md:block">
        <Button 
          className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white rounded-md"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
