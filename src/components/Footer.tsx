
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("bg-background border-t py-12 px-6", className)}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-500 to-teal-500"></div>
            <span className="font-bold text-xl">Gowaveline</span>
          </div>
          <p className="text-muted-foreground">
            Modern solutions for merchant statement analysis and processing fee optimization.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Product</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Connect</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Facebook</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
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
          <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
