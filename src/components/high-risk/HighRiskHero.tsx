
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnimatedText from '@/components/AnimatedText';

const HighRiskHero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <AnimatedText type="slide" direction="up" className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0EA5E9]">High Risk Payment Processing Solutions</h1>
        </AnimatedText>
        <AnimatedText type="fade" delay={300} className="mb-8">
          <p className="text-xl text-[#0EA5E9] max-w-3xl mx-auto">
            When traditional payment processors say "no," Waveline says "let's find a way." We specialize in providing reliable merchant services to businesses in high-risk industries.
          </p>
        </AnimatedText>
        
        <AnimatedText type="fade" delay={500}>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Button 
              onClick={() => navigate('/')}
              className="px-6 py-3 text-white font-semibold text-lg rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] shadow-lg"
            >
              Analyze Statement
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              variant="outline" 
              className="px-6 py-3 border-[#0EA5E9] text-[#0EA5E9] font-semibold text-lg"
            >
              Contact Us
            </Button>
          </div>
        </AnimatedText>
      </div>
    </div>
  );
};

export default HighRiskHero;
