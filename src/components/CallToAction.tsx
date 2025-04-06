
import React from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const CallToAction = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="relative px-6 lg:px-8 py-16 md:py-24 bg-gradient-to-b from-orange-50/80 to-orange-100/30">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0EA5E9] mb-6">Ready to Optimize Your Processing?</h2>
          
          <p className="mt-6 text-lg leading-8 text-orange-500 max-w-3xl mx-auto">
            Upload your merchant statement today and discover how much you could be saving with our detailed analysis and industry expertise.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={() => navigate('/contact')}
              className="px-6 py-3 text-white font-semibold text-lg rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 shadow-lg"
            >
              Contact Us
            </Button>
            <Button 
              onClick={() => navigate('/industries')}
              variant="outline" 
              className="px-6 py-3 text-[#0EA5E9] font-semibold text-lg"
            >
              View Industries
            </Button>
          </div>
        </div>
        
        <div className="mt-16 bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#0EA5E9]">Get Your Free Analysis</h2>
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
