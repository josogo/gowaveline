
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';
import { Button } from '@/components/ui/button';

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
        <Features />
        <CallToAction />
      </main>
      
      {/* Small admin button at the bottom */}
      <div className="w-full flex justify-center py-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 opacity-30 hover:opacity-100 px-2 py-1 h-auto"
          onClick={() => navigate('/admin/dashboard')}
        >
          Admin
        </Button>
      </div>
    </div>
  );
};

export default Index;
