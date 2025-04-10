
import React from 'react';
import { Dice5, Trophy } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Gaming and gambling related industries
export const gamingIndustries: HighRiskIndustry[] = [
  {
    id: 10,
    title: "Online Gambling & Sports Betting",
    description: "Gambling and sports betting platforms need compliant payment processing that can handle high volumes while managing regulatory requirements.",
    icon: <Dice5 className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For gambling and sports betting operators, we offer high-volume merchant accounts with strong fraud prevention tools, geolocation services to ensure regulatory compliance, and rapid settlement options to keep your platform running smoothly. Our solutions are designed to navigate the complex legal landscape while providing reliable payment processing."
  },
  {
    id: 17,
    title: "Fantasy Sports Platforms",
    description: "Fantasy sports businesses require payment solutions that can handle high volumes of small transactions and seasonal fluctuations.",
    icon: <Trophy className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our fantasy sports payment solutions include high-volume micro-transaction processing, seasonal scaling capabilities, and specialized fraud prevention for gaming platforms. We understand the unique challenges of fantasy sports and provide stable processing that can handle your busiest seasons."
  }
];
