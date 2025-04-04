
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const navigate = useNavigate();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn("bg-gradient-to-b from-orange-50 to-orange-100 border-t py-12 px-6", className)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/13e5ff13-2a8e-45f3-b1bc-ed972c3308ba.png" 
              alt="Waveline Logo" 
              className="h-16 w-auto"
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
          <h3 className="font-semibold text-lg mb-4 text-orange-500">Company</h3>
          <ul className="space-y-3">
            <li><button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-orange-500 transition-colors">About</button></li>
            <li><button onClick={() => navigate('/case-studies')} className="text-muted-foreground hover:text-orange-500 transition-colors">Case Studies</button></li>
            <li><button onClick={() => navigate('/blog')} className="text-muted-foreground hover:text-orange-500 transition-colors">Blog</button></li>
            <li><button onClick={() => navigate('/comparison')} className="text-muted-foreground hover:text-orange-500 transition-colors">Stripe & Shopify Comparison</button></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4 text-orange-500">Resources</h3>
          <ul className="space-y-3">
            <li><button onClick={() => navigate('/services')} className="text-muted-foreground hover:text-orange-500 transition-colors">Services</button></li>
            <li><button onClick={() => navigate('/industries')} className="text-muted-foreground hover:text-orange-500 transition-colors">Industries</button></li>
            <li><button onClick={() => navigate('/high-risk')} className="text-muted-foreground hover:text-orange-500 transition-colors">High Risk Solutions</button></li>
            <li><button onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-orange-500 transition-colors">Contact Us</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-orange-200 flex flex-col md:flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm mb-4 md:mb-0">
          &copy; {currentYear} Gowaveline. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <button onClick={() => navigate('/privacy-policy')} className="text-muted-foreground hover:text-orange-500 text-sm">Privacy Policy</button>
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-orange-500 text-sm">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
