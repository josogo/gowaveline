
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';

const Index = () => {
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
    </div>
  );
};

export default Index;
