
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LockKeyhole, Shield, Mail } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const navigate = useNavigate();
  
  const currentYear = new Date().getFullYear();
  
  const handleNavigation = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };
  
  return (
    <footer className={cn("bg-gradient-to-b from-orange-50 to-orange-100 border-t py-12 px-6", className)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center mb-6">
            <img 
              src="/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png" 
              alt="Waveline Logo" 
              className="h-32 w-auto"
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
            <li><button onClick={() => handleNavigation('/about')} className="text-muted-foreground hover:text-orange-500 transition-colors">About</button></li>
            <li><button onClick={() => handleNavigation('/case-studies')} className="text-muted-foreground hover:text-orange-500 transition-colors">Case Studies</button></li>
            <li><button onClick={() => handleNavigation('/blog')} className="text-muted-foreground hover:text-orange-500 transition-colors">Blog</button></li>
            <li><button onClick={() => handleNavigation('/comparison')} className="text-muted-foreground hover:text-orange-500 transition-colors">Stripe & Shopify Comparison</button></li>
            <li><button onClick={() => handleNavigation('/partners')} className="text-muted-foreground hover:text-orange-500 transition-colors">Partners</button></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4 text-orange-500">Resources</h3>
          <ul className="space-y-3">
            <li><button onClick={() => handleNavigation('/services')} className="text-muted-foreground hover:text-orange-500 transition-colors">Services</button></li>
            <li><button onClick={() => handleNavigation('/industries')} className="text-muted-foreground hover:text-orange-500 transition-colors">Industries</button></li>
            <li><button onClick={() => handleNavigation('/high-risk')} className="text-muted-foreground hover:text-orange-500 transition-colors">High Risk Solutions</button></li>
            <li><button onClick={() => handleNavigation('/contact')} className="text-muted-foreground hover:text-orange-500 transition-colors">Contact Us</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-orange-200 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Gowaveline. All rights reserved.
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-orange-500 flex items-center gap-1 text-xs"
            onClick={() => handleNavigation('/admin/login')}
          >
            <LockKeyhole className="h-3 w-3" />
            Admin Login
          </Button>
        </div>
        <div className="flex space-x-6">
          <button onClick={() => handleNavigation('/privacy-policy')} className="text-muted-foreground hover:text-orange-500 text-sm">Privacy Policy</button>
          <button onClick={() => handleNavigation('/')} className="text-muted-foreground hover:text-orange-500 text-sm">Terms of Service</button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-orange-500 flex items-center text-xs opacity-70"
            onClick={() => handleNavigation('/admin/dashboard')}
          >
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Button>
        </div>
      </div>
      
      {/* Small admin button at very bottom */}
      <div className="w-full flex justify-center mt-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 opacity-40 hover:opacity-100"
          onClick={() => handleNavigation('/admin/dashboard')}
        >
          Admin
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
