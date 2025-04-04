
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';
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
      
      {/* Admin button in the Index component has been removed as it was duplicative of the one in Footer */}
    </div>
  );
};

export default Index;
