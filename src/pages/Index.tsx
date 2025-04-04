
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately clear any previous analysis data when landing on the home page
    console.log("Index page loaded - clearing localStorage");
    localStorage.removeItem('statementAnalysis');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AnimatedText type="fade" delay={500}>
          <Features />
        </AnimatedText>
        <AnimatedText type="fade" delay={600}>
          <CallToAction />
        </AnimatedText>
      </main>
      
      {/* Small admin button at the bottom */}
      <div className="w-full flex justify-center py-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 opacity-40 hover:opacity-100"
          onClick={() => navigate('/admin/dashboard')}
        >
          Admin
        </Button>
      </div>
    </div>
  );
};

export default Index;
