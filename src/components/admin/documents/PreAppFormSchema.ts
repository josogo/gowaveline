
import { z } from 'zod';

// Define the schema for pre-application form values
export const preAppFormSchema = z.object({
  // Business Structure
  businessStructure: z.enum(['sole_proprietorship', 'corporation', 'llc', 'non_profit', 'government', 'other']),
  businessStructureOther: z.string().optional(),
  
  // Business Info
  businessName: z.string().optional(), // Add business name field
  streetAddress: z.string().optional(),
  mailingAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessFax: z.string().optional(),
  customerServicePhone: z.string().optional(),
  customerServiceEmail: z.string().email().optional(),
  website: z.string().optional(),
  
  // Authorized Contact
  authorizedContactName: z.string().optional(),
  
  // Equipment & Software
  terminalGateway: z.string().optional(),
  shoppingCart: z.string().optional(),
  
  // Business Location
  employeeCount: z.string().optional(),
  locationType: z.enum(['home', 'office', 'storefront']).optional(),
  ownOrRent: z.enum(['own', 'rent']).optional(),
  squareFootage: z.enum(['0-500', '501-2000', '2001-5000', '5000+']).optional(),
  
  // Principal Info
  principalName: z.string().optional(),
  ownershipPercentage: z.string().optional(),
  additionalOwners: z.boolean(),
  principalTitle: z.string().optional(),
  principalPhone: z.string().optional(),
  dateOfBirthMonth: z.string().optional(),
  dateOfBirthDay: z.string().optional(),
  dateOfBirthYear: z.string().optional(),
  ssn: z.string().optional(),
  driversLicense: z.string().optional(),
  licenseExpMonth: z.string().optional(),
  licenseExpDay: z.string().optional(),
  licenseExpYear: z.string().optional(),
  licenseState: z.string().optional(),
  principalAddress: z.string().optional(),
  principalEmail: z.string().email().optional(),
  
  // Banking Info
  bankName: z.string().optional(),
  bankContactName: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  
  // Business Description
  productsServices: z.string().optional(),
  yearsInOperation: z.string().optional(),
  storageLocation: z.string().optional(),
  
  // Processing Volume
  totalMonthlyVolume: z.string().optional(),
  visaMastercardVolume: z.string().optional(),
  amexVolume: z.string().optional(),
  averageTicket: z.string().optional(),
  highestTicket: z.string().optional(),
  
  // Transaction Method
  faceToFacePercentage: z.string().optional(),
  motoPercentage: z.string().optional(),
  ecommercePercentage: z.string().optional(),
  
  // Refund/Cancellation Policy
  hasRefundPolicy: z.boolean(),
  policyType: z.enum(['exchange', 'store_credit', 'refund_30_days', 'other']).optional(),
  policyTypeOther: z.string().optional(),
  hasProcessingHistory: z.boolean().optional(),
  currentPreviousProcessors: z.string().optional(),
  hasPreviousTerminations: z.boolean().optional(),
  terminationsExplanation: z.string().optional(),
  hasBankruptcies: z.boolean().optional(),
  bankruptciesExplanation: z.string().optional(),
  
  // Business Type
  b2bPercentage: z.string().optional(),
  b2cPercentage: z.string().optional(),
  isSeasonalBusiness: z.boolean().optional(),
  hasRecurringPayments: z.boolean().optional(),
  recurringPaymentsDetails: z.string().optional(),
  
  // eCommerce / Card-Not-Present
  productPurchaseAddresses: z.string().optional(),
  inventoryOwnership: z.enum(['merchant', 'vendor']).optional(),
  fulfillmentProviders: z.string().optional(),
  shoppingCartPlatforms: z.string().optional(),
  purchaseMethods: z.array(z.string()),
  purchaseMethodsOther: z.string().optional(),
  callCenterProviders: z.string().optional(),
  authToShipTimeframe: z.enum(['0-7', '8-14', '15-30', '30-90', '90+']).optional(),
  deliveryTimeframe: z.enum(['0-7', '8-14', '15-30', '30-90', '90+']).optional(),
  chargebackManagement: z.string().optional(),
  depositsRequired: z.boolean().optional(),
  depositPercentage: z.string().optional(),
  fullPaymentTiming: z.enum(['advance', 'delivery']).optional(),
  salesRegions: z.string().optional(),
  internationalTransactionsPercentage: z.string().optional(),
  shippingMethod: z.array(z.string()),
  shippingMethodOther: z.string().optional(),
  advertisingChannels: z.array(z.string()),
  advertisingChannelsOther: z.string().optional(),
  warrantyProvider: z.enum(['merchant', 'manufacturer']).optional(),
});

// Export the type for pre-application form values
export type PreAppFormValues = z.infer<typeof preAppFormSchema>;
