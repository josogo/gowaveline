
import React from 'react';
import { Home } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Real estate and timeshare related industries
export const realEstateIndustries: HighRiskIndustry[] = [
  {
    id: 15,
    title: "Timeshare & Vacation Ownership",
    description: "Timeshare businesses face unique payment processing challenges due to large upfront payments and recurring maintenance fees.",
    icon: <Home className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our timeshare payment solutions include high-ticket transaction processing, specialized underwriting for vacation ownership models, and recurring billing systems for maintenance fees. We help you navigate the high-risk classification while maintaining stable, reliable payment processing for both sales and ongoing fees."
  }
];
