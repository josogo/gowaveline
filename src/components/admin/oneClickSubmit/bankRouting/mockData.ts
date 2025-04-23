
export const mockBanks = [
  { 
    id: 1, 
    name: 'FirstData Processing', 
    compatibility: 92, 
    notes: 'Preferred for CBD merchants with less than $150k monthly volume',
    apiAvailable: true
  },
  { 
    id: 2, 
    name: 'Elavon Merchant Services', 
    compatibility: 87, 
    notes: 'Good for established businesses with clean processing history',
    apiAvailable: true
  },
  { 
    id: 3, 
    name: 'Wells Fargo Merchant', 
    compatibility: 74, 
    notes: 'Requires minimum 1 year in business, prefers established companies',
    apiAvailable: false
  },
  { 
    id: 4, 
    name: 'Stripe Connect', 
    compatibility: 62, 
    notes: 'Not ideal for high-risk, but may accept given your chargebacks are low',
    apiAvailable: true
  },
  { 
    id: 5, 
    name: 'Chase Payment Processing', 
    compatibility: 55, 
    notes: 'Low match due to industry classification and monthly volume',
    apiAvailable: false
  },
];
