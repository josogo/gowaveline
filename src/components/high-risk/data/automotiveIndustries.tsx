
import React from 'react';
import { Car } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Automotive related industries
export const automotiveIndustries: HighRiskIndustry[] = [
  {
    id: 22,
    title: "Auto Warranty & Protection Plans",
    description: "Auto warranty companies face high scrutiny from payment processors due to chargeback risks and regulatory concerns.",
    icon: <Car className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For auto warranty providers, we offer specialized merchant accounts with contract verification systems, compliant billing procedures, and dispute management tools designed for your industry. Our solutions help you maintain stable payment processing while navigating the high-risk classification."
  }
];
