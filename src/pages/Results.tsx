
import React from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-12 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Statement Analysis</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've analyzed your merchant statement and found several insights that could help you reduce costs.
          </p>
        </div>
        <Dashboard />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Results;
