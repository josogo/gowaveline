
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <footer className={cn("bg-background border-t py-12 px-6", className)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/2d9abfe8-af53-43b1-9ce4-d5c73518ff44.png" 
              alt="Waveline Logo" 
              className="h-12 w-auto"
            />
          </div>
          <p className="text-muted-foreground">
            Modern solutions for merchant statement analysis and processing fee optimization.
          </p>
          <div className="mt-4">
            <p className="text-muted-foreground">info@gowaveline.com</p>
            <p className="text-muted-foreground">(805) 586-3591</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-3">
            <li><button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground transition-colors">About</button></li>
            <li><button onClick={() => navigate('/case-studies')} className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</button></li>
            <li><button onClick={() => navigate('/blog')} className="text-muted-foreground hover:text-foreground transition-colors">Blog</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Gowaveline. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a>
          <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
