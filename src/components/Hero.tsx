
import React from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

const Hero = () => {
  return (
    <div className="relative px-6 lg:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
              Analyze
            </span>{" "}
            your merchant statements in seconds
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get detailed insights into your processing fees, identify hidden charges, and understand your effective rate with our intelligent statement analyzer.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button className="px-6 py-3 text-white font-semibold text-lg rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 shadow-lg">
              Learn more
            </Button>
            <Button variant="outline" className="px-6 py-3 text-primary font-semibold text-lg">
              View demo
            </Button>
          </div>
        </div>
        
        <div className="mt-16 glass-card p-8 animate-slide-up">
          <h2 className="text-2xl font-semibold text-center mb-6">Upload Your Statement</h2>
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default Hero;
