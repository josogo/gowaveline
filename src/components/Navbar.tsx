
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/get-started');
  };

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
      
      <div className="hidden md:flex items-center space-x-6">
        <Button variant="link" className="text-[#0EA5E9]" onClick={() => navigate('/')}>Home</Button>
        <Button variant="link" className="text-[#0EA5E9]" onClick={() => navigate('/industries')}>Industries</Button>
        <Button variant="link" className="text-[#0EA5E9]" onClick={() => navigate('/services')}>Services</Button>
        <Button variant="link" className="text-[#0EA5E9]" onClick={() => navigate('/high-risk')}>High Risk</Button>
        <Button variant="link" className="text-[#0EA5E9]" onClick={() => navigate('/about')}>About Us</Button>
        <Button variant="link" className="text-[#0EA5E9]" onClick={() => navigate('/contact')}>Contact</Button>
      </div>
      
      <div>
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
