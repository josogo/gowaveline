
import React from 'react';
import { GraduationCap } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Education and coaching related industries
export const educationIndustries: HighRiskIndustry[] = [
  {
    id: 11,
    title: "Coaching & Online Courses",
    description: "Coaching services and online course providers face challenges with traditional payment processors due to subscription models and chargeback risks.",
    icon: <GraduationCap className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "We support coaches and online education businesses with subscription-friendly payment solutions, customizable recurring billing options, and chargeback prevention tools that protect your revenue stream. Our merchant accounts are specifically designed to accommodate the unique business model of information and service-based businesses."
  }
];
