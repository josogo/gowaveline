
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

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
      <Footer />
      
      {/* Small admin button at the bottom */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center py-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 opacity-30 hover:opacity-100 px-2 py-1 h-auto bg-white/70 backdrop-blur-sm"
          onClick={() => navigate('/admin/dashboard')}
        >
          Admin
        </Button>
      </div>
    </div>
  );
};

export default Index;
