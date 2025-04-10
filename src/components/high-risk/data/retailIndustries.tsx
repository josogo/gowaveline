
import React from 'react';
import { Copy, Package, Truck, Hammer, ShoppingCart } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Retail related industries
export const retailIndustries: HighRiskIndustry[] = [
  {
    id: 24,
    title: "Replica & Gray Market Goods",
    description: "Businesses selling replica or gray market items need specialized payment processing that understands their unique challenges.",
    icon: <Copy className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For replica and gray market retailers, we provide merchant accounts with clear policies, chargeback prevention systems tailored to your products, and international processing capabilities. Our solutions help you operate legally while maintaining stable payment processing."
  },
  {
    id: 25,
    title: "Subscription Box Services",
    description: "Subscription boxes face high chargeback rates and processing challenges due to recurring billing and product delivery timelines.",
    icon: <Package className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our subscription box payment solutions include specialized recurring billing platforms, dunning management tools to prevent failed payments, and delivery confirmation integration to reduce chargebacks. We understand subscription economics and provide stable processing that grows with your business."
  },
  {
    id: 27,
    title: "Drop Shipping Businesses",
    description: "Drop shippers face payment processing challenges due to extended delivery times and product quality concerns.",
    icon: <Truck className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our drop shipping payment solutions include merchant accounts that understand extended fulfillment timelines, shipping integration to reduce chargebacks, and fraud prevention tools designed for e-commerce. We help drop shippers maintain reliable processing despite the high-risk classification of many drop shipping categories."
  },
  {
    id: 32,
    title: "Auction Houses",
    description: "Auction businesses need payment processing that can handle high-value transactions and verification of both buyers and sellers.",
    icon: <Hammer className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For auction houses, we provide merchant accounts with high-ticket transaction capabilities, escrow-compatible payment options, and buyer/seller verification systems. Our solutions help you manage the unique risks of auction sales while maintaining reliable payment processing."
  },
  {
    id: 33,
    title: "Online Furniture & Large Ticket Retail",
    description: "Furniture retailers and large ticket sellers face processing challenges due to delivery timeframes and big-ticket transactions.",
    icon: <ShoppingCart className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our large ticket retail solutions include specialized merchant accounts for big purchases, delivery confirmation integration to prevent chargebacks, and financing options for your customers. We help furniture and high-value retailers maintain stable processing despite industry-specific challenges."
  }
];
