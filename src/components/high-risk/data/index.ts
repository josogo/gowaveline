
// Export all industry data from one central file

// Import all industry segments
import { cannabisIndustries } from './cannabisIndustries';
import { securityIndustries } from './securityIndustries';
import { adultIndustries } from './adultIndustries';
import { financialIndustries } from './financialIndustries';
import { healthIndustries } from './healthIndustries';
import { techIndustries } from './techIndustries';
import { tobaccoIndustries } from './tobaccoIndustries';
import { travelIndustries } from './travelIndustries';
import { gamingIndustries } from './gamingIndustries';
import { educationIndustries } from './educationIndustries';
import { mlmIndustries } from './mlmIndustries';
import { realEstateIndustries } from './realEstateIndustries';
import { entertainmentIndustries } from './entertainmentIndustries';
import { automotiveIndustries } from './automotiveIndustries';
import { retailIndustries } from './retailIndustries';

// Combine all industry data into a single array to maintain the same structure as before
export const industryData = [
  ...cannabisIndustries,
  ...securityIndustries,
  ...adultIndustries,
  ...financialIndustries,
  ...healthIndustries,
  ...techIndustries,
  ...tobaccoIndustries,
  ...travelIndustries,
  ...gamingIndustries,
  ...educationIndustries,
  ...mlmIndustries,
  ...realEstateIndustries,
  ...entertainmentIndustries,
  ...automotiveIndustries,
  ...retailIndustries
];
