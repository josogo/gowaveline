
import React from 'react';
import { AlertTriangle } from './iconsImport';
import { HighRiskIndustry } from '../types';

// CBD & Cannabis industry
export const cannabisIndustries: HighRiskIndustry[] = [
  {
    id: 1,
    title: "CBD & Cannabis",
    description: "Legal CBD and cannabis businesses face unique payment processing challenges. We provide compliant solutions that keep your business running smoothly.",
    icon: <AlertTriangle className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our specialized CBD & Cannabis payment solutions include compliant merchant accounts that understand the legal distinctions in your industry, chargeback protection systems tailored for high-risk verticals, and banking relationships with institutions that specifically support cannabis-adjacent businesses. We'll help you navigate the complex regulatory landscape while maintaining reliable payment processing."
  }
];
