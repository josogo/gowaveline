
import React from 'react';
import { Users } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Multi-level marketing related industries
export const mlmIndustries: HighRiskIndustry[] = [
  {
    id: 14,
    title: "Multi-Level Marketing (MLM)",
    description: "MLM businesses need payment solutions that can handle complex commission structures and distributed selling networks.",
    icon: <Users className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For MLM companies, we offer payment systems that integrate with commission structures, multi-tier affiliate tracking capabilities, and robust fraud prevention to protect your business and distributors. Our solutions are designed to scale with your network while maintaining compliance and stability."
  }
];
