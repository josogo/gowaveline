
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from '@/components/FileUpload';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative py-16 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-teal-100 opacity-50"></div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Optimize Your Processing Costs?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Upload your statement now and discover how much you could save with our detailed analysis and recommendations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-6 text-lg rounded-md"
              >
                Submit Statement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#0EA5E9]">Upload Your Statement</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <FileUpload />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
