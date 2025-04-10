
import React from 'react';
import { AlertTriangle } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Tobacco and vaping related industries
export const tobaccoIndustries: HighRiskIndustry[] = [
  {
    id: 8,
    title: "Tobacco & E-cigarettes",
    description: "Vape shops, tobacco retailers, and e-cigarette manufacturers require specialized processing solutions to overcome regulatory hurdles.",
    icon: <AlertTriangle className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our tobacco and e-cigarette payment solutions include compliant merchant accounts familiar with age verification requirements, specialized fraud protection designed for vape and tobacco sales, and processing capabilities that work with the unique regulatory challenges of your industry. We'll help you navigate changing regulations while maintaining reliable payment processing."
  }
];
