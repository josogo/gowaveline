
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HighRiskHero from '@/components/high-risk/HighRiskHero';
import IndustriesSection from '@/components/high-risk/IndustriesSection';
import BenefitsSection from '@/components/high-risk/BenefitsSection';
import ImageCarousel from '@/components/high-risk/ImageCarousel';

const HighRisk = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HighRiskHero />
        <IndustriesSection />
        <BenefitsSection />
        <ImageCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default HighRisk;
