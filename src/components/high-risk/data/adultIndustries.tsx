
import React from 'react';
import { CreditCard, Heart } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Adult content and dating related industries
export const adultIndustries: HighRiskIndustry[] = [
  {
    id: 3,
    title: "Adult Content & Dating",
    description: "Adult websites, content creators, and dating platforms require discreet, reliable payment processing that traditional banks often deny.",
    icon: <CreditCard className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our adult industry solutions include discreet billing descriptors that protect customer privacy, high-volume processing capabilities for subscription-based models, and specialized fraud prevention tools designed for dating and content platforms. We work with acquiring banks that understand your business model and won't suddenly terminate your account based on industry type."
  },
  {
    id: 20,
    title: "Dating Services",
    description: "Dating platforms need discreet, reliable payment processing that can handle subscription billing and high chargeback rates.",
    icon: <Heart className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For dating services, we provide merchant accounts with discreet billing descriptors, robust subscription management tools, and specialized fraud prevention designed for dating platforms. Our solutions ensure reliable processing without sudden account terminations that plague this industry."
  }
];
