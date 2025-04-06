import React from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { useNavigate } from 'react-router-dom';
import AnimatedText from '@/components/AnimatedText';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative px-6 lg:px-8 py-16 md:py-24 bg-gradient-to-b from-orange-50/80 to-orange-100/30">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png" 
              alt="Waveline Logo" 
              className="h-24 md:h-32 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {isMobile ? (
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
                High Risk
              </span>
              <span className="text-[#0EA5E9]"> Processing Made Easy</span>
            </h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
                High Risk
              </span>
              <span className="text-[#0EA5E9]"> Processing Made Easy</span>
            </h1>
          )}
          
          <p className="mt-6 text-lg leading-8 text-orange-500">
            Get detailed insights into your processing fees, identify hidden charges, and understand your effective rate with our intelligent statement analyzer.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={() => handleNavigation('/about')}
              className="px-6 py-3 text-white font-semibold text-lg rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 shadow-lg"
            >
              Learn more
            </Button>
            <Button 
              onClick={() => handleNavigation('/get-started')}
              variant="outline" 
              className="px-6 py-3 text-[#0EA5E9] font-semibold text-lg"
            >
              View demo
            </Button>
          </div>
        </div>
        
        <div className="mt-16 bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#0EA5E9]">Upload Your Statement</h2>
          <FileUpload />
          
          {isMobile && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => handleNavigation('/get-started')}
                className="px-6 py-3 text-white font-semibold text-lg rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] shadow-lg w-full"
              >
                Submit statement
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
