
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HighRiskHero from '@/components/high-risk/HighRiskHero';
import IndustriesSection from '@/components/high-risk/IndustriesSection';
import BenefitsSection from '@/components/high-risk/BenefitsSection';

const HighRisk = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HighRiskHero />
        <IndustriesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
};

export default HighRisk;
