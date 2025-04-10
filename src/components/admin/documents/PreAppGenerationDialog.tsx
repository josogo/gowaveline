
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  // Business Structure
  businessStructure: z.enum(['Sole Proprietorship', 'Corporation', 'LLC', 'Non-profit (401(c))', 'Government', 'Other']),
  otherBusinessStructure: z.string().optional(),
  
  // Business Information
  businessName: z.string().min(1, 'Business name is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  mailingAddress: z.string().min(1, 'Mailing address is required'),
  businessPhone: z.string().min(1, 'Business phone is required'),
  businessEmail: z.string().email('Invalid email format'),
  businessFax: z.string().optional(),
  customerServicePhone: z.string().optional(),
  customerServiceEmail: z.string().email('Invalid email format').optional(),
  website: z.string().optional(),
  
  // Authorized Contact
  contactName: z.string().min(1, 'Contact name is required'),
  
  // Equipment/Software
  terminalGateway: z.string().optional(),
  shoppingCart: z.string().optional(),
  
  // Business Location
  employeeCount: z.string().optional(),
  locationType: z.enum(['Home/Residential', 'Office/Business District', 'Storefront']),
  ownOrRent: z.enum(['Own', 'Rent']),
  squareFootage: z.enum(['0-500', '501-2000', '2001-5000', '5000+']),
  
  // Principal Information
  principalName: z.string().min(1, 'Principal name is required'),
  ownershipPercentage: z.string().min(1, 'Ownership percentage is required'),
  hasAdditionalOwners: z.boolean().default(false),
  title: z.string().min(1, 'Title is required'),
  homePhone: z.string().min(1, 'Home phone is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssn: z.string().min(1, 'SSN is required'),
  driversLicense: z.string().min(1, 'Driver\'s license number is required'),
  licenseExpDate: z.string().min(1, 'License expiration date is required'),
  licenseState: z.string().min(1, 'License state is required'),
  homeAddress: z.string().min(1, 'Home address is required'),
  personalEmail: z.string().email('Invalid email format'),
  
  // Bank Settlement Information
  bankName: z.string().min(1, 'Bank name is required'),
  bankContact: z.string().optional(),
  routingNumber: z.string().min(1, 'Routing number is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  
  // Business Description
  productsServices: z.string().min(1, 'Products/Services description is required'),
  yearsInOperation: z.string().min(1, 'Years in operation is required'),
  storageLocation: z.string().optional(),
  
  // Processing Volume
  monthlyVolume: z.string().min(1, 'Monthly volume is required'),
  visaMastercardVolume: z.string().optional(),
  amexVolume: z.string().optional(),
  averageTicket: z.string().min(1, 'Average ticket is required'),
  highestTicket: z.string().min(1, 'Highest ticket is required'),
  
  // Transaction Methods
  faceToFacePercent: z.string().optional(),
  motoPercent: z.string().optional(),
  ecommercePercent: z.string().optional(),
  
  // Refund Policy
  hasRefundPolicy: z.enum(['Yes', 'No']),
  refundPolicyType: z.enum(['Exchange', 'Store Credit', 'Refund within 30 days', 'Other']).optional(),
  otherRefundPolicy: z.string().optional(),
  
  // Processing History
  hasProcessingHistory: z.enum(['Yes', 'No']),
  previousProcessor: z.string().optional(),
  hasPreviousTerminations: z.enum(['Yes', 'No']),
  terminationsExplanation: z.string().optional(),
  hasBankruptcies: z.enum(['Yes', 'No']),
  bankruptciesExplanation: z.string().optional(),
  
  // Business Type
  b2bPercent: z.string(),
  b2cPercent: z.string(),
  isSeasonalBusiness: z.enum(['Yes', 'No']),
  hasRecurringPayments: z.enum(['Yes', 'No']),
  recurringPaymentsDetails: z.string().optional(),
  
  // eCommerce
  productPurchaseAddresses: z.string().optional(),
  inventoryOwner: z.enum(['Merchant', 'Vendor (Drop Ship)']),
  fulfillmentProviders: z.string().optional(),
  shoppingCartPlatforms: z.string().optional(),
  purchaseMethods: z.array(z.string()).optional(),
  otherPurchaseMethod: z.string().optional(),
  callCenterProviders: z.string().optional(),
  authToShipTimeframe: z.enum(['0–7 days', '8–14 days', '15–30 days', '30–90 days', '90+ days']),
  deliveryTimeframe: z.enum(['0–7 days', '8–14 days', '15–30 days', '30–90 days', '90+ days']),
  chargebackSystem: z.string().optional(),
  requiresDeposits: z.enum(['Yes', 'No']),
  depositPercent: z.string().optional(),
  paymentTiming: z.enum(['100% Paid in Advance', '100% Paid on Delivery/Completion']),
  salesRegions: z.string().optional(),
  internationalPercent: z.string().optional(),
  shippingMethods: z.array(z.string()).optional(),
  otherShippingMethod: z.string().optional(),
  advertisingChannels: z.array(z.string()).optional(),
  otherAdvertisingChannel: z.string().optional(),
  warrantyProvider: z.enum(['Merchant', 'Manufacturer'])
});

type FormValues = z.infer<typeof formSchema>;

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("business-info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessStructure: 'Sole Proprietorship',
      businessName: '',
      streetAddress: '',
      mailingAddress: '',
      businessPhone: '',
      businessEmail: '',
      contactName: '',
      locationType: 'Office/Business District',
      ownOrRent: 'Own',
      squareFootage: '0-500',
      principalName: '',
      ownershipPercentage: '',
      hasAdditionalOwners: false,
      title: '',
      homePhone: '',
      dateOfBirth: '',
      ssn: '',
      driversLicense: '',
      licenseExpDate: '',
      licenseState: '',
      homeAddress: '',
      personalEmail: '',
      bankName: '',
      routingNumber: '',
      accountNumber: '',
      productsServices: '',
      yearsInOperation: '',
      monthlyVolume: '',
      averageTicket: '',
      highestTicket: '',
      faceToFacePercent: '0',
      motoPercent: '0',
      ecommercePercent: '100',
      hasRefundPolicy: 'Yes',
      hasProcessingHistory: 'No',
      hasPreviousTerminations: 'No',
      hasBankruptcies: 'No',
      b2bPercent: '0',
      b2cPercent: '100',
      isSeasonalBusiness: 'No',
      hasRecurringPayments: 'No',
      inventoryOwner: 'Merchant',
      authToShipTimeframe: '0–7 days',
      deliveryTimeframe: '0–7 days',
      requiresDeposits: 'No',
      paymentTiming: '100% Paid in Advance',
      warrantyProvider: 'Merchant'
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Check if the user is authenticated
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        toast.error("Authentication error: You must be logged in to generate a pre-application PDF.");
        setIsSubmitting(false);
        return;
      }
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-pre-app', {
        body: { formData: values }
      });

      if (error) {
        console.error('Error generating pre-application PDF:', error);
        throw new Error(error.message || 'Failed to generate pre-application PDF');
      }
      
      if (!data || !data.pdfBase64) {
        throw new Error('Invalid response from server');
      }

      // Convert the base64 data to a Blob
      const binaryData = atob(data.pdfBase64);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      
      // Create a Blob from the binary data
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `pre_application_form.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast.success('Pre-application form generated successfully');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error generating pre-application PDF:', error);
      toast.error(error.message || 'Failed to generate pre-application PDF');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Pre-Application Form</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="business-info">Business Info</TabsTrigger>
                <TabsTrigger value="principal-info">Principal Info</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="ecommerce">eCommerce</TabsTrigger>
              </TabsList>
              
              {/* Business Info Tab */}
              <TabsContent value="business-info" className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> Business Structure & Information
                  </h3>
                  <p className="text-xs text-blue-700">
                    Complete the basic information about the business entity.
                  </p>
                </div>
                
                {/* Business Structure */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Business Structure</h3>
                  <FormField
                    control={form.control}
                    name="businessStructure"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-3 gap-2"
                          >
                            {['Sole Proprietorship', 'Corporation', 'LLC', 'Non-profit (401(c))', 'Government', 'Other'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('businessStructure') === 'Other' && (
                    <FormField
                      control={form.control}
                      name="otherBusinessStructure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Other Business Structure:</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {/* Business Information */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Business Information</h3>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street (Location) Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mailingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mailing (Legal) Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business/Contact Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business/Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="businessFax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Fax # (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerServicePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Service Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerServiceEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Service Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website/URL (without http://)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Authorized Contact */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Authorized Contact</h3>
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Equipment / Software */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Equipment / Software</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="terminalGateway"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terminal/Gateway Used</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., VX 520, Authorize.net, NMI" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shoppingCart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shopping Cart (if applicable)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">If using Shopify, request Authorize.net Gateway</p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Business Location */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Business Location</h3>
                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locationType"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Location Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-2"
                          >
                            {['Home/Residential', 'Office/Business District', 'Storefront'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownOrRent"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Own or Rent</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Own', 'Rent'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="squareFootage"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Approx. Square Footage</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {[
                              { label: '0–500 ft²', value: '0-500' },
                              { label: '501–2,000 ft²', value: '501-2000' },
                              { label: '2,001–5,000 ft²', value: '2001-5000' },
                              { label: '5,000+ ft²', value: '5000+' }
                            ].map((option) => (
                              <FormItem key={option.value} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Principal Info Tab */}
              <TabsContent value="principal-info" className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> Principal Information
                  </h3>
                  <p className="text-xs text-blue-700">
                    Enter details about the primary business owner or principal.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Principal Information</h3>
                  <FormField
                    control={form.control}
                    name="principalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ownershipPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ownership %</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasAdditionalOwners"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Check here if additional owners/members have 25%+ equity
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Owner, CEO, etc.)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="homePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth (MM/DD/YYYY)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM/DD/YYYY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ssn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SSN</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="driversLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License #</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="licenseExpDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exp Date (MM/DD/YYYY)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM/DD/YYYY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="licenseState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personalEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Banking Tab */}
              <TabsContent value="banking" className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> Banking & Business Description
                  </h3>
                  <p className="text-xs text-blue-700">
                    Enter banking information and business details.
                  </p>
                </div>
                
                {/* Bank Settlement Information */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Bank Settlement Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bankContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name at Bank</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Business Description */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Business Description</h3>
                  <FormField
                    control={form.control}
                    name="productsServices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products/Services Sold</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsInOperation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years in Operation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="storageLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location (if applicable)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Processing Tab */}
              <TabsContent value="processing" className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> Processing Details & History
                  </h3>
                  <p className="text-xs text-blue-700">
                    Enter information about payment processing volumes and history.
                  </p>
                </div>
                
                {/* Processing Volume */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Processing Volume</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Total Monthly Volume ($)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="visaMastercardVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visa/Mastercard Volume ($)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="amexVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>American Express Volume ($)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="averageTicket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Ticket ($)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="highestTicket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Ticket ($)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Transaction Method */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Transaction Method (Must Equal 100%)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="faceToFacePercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Face-to-Face (Retail) %</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="motoPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone/Mail/Email (MOTO) %</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ecommercePercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internet (eCommerce) %</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Calculated total */}
                  {(() => {
                    const face = parseInt(form.watch('faceToFacePercent') || '0');
                    const moto = parseInt(form.watch('motoPercent') || '0');
                    const ecom = parseInt(form.watch('ecommercePercent') || '0');
                    const total = face + moto + ecom;
                    
                    return (
                      <div className={`text-right text-sm ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>
                        Total: {total}% {total !== 100 && '(must equal 100%)'}
                      </div>
                    );
                  })()}
                </div>
                
                {/* Refund / Cancellation Policy */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Refund / Cancellation Policy</h3>
                  <FormField
                    control={form.control}
                    name="hasRefundPolicy"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Do you have a refund policy?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('hasRefundPolicy') === 'Yes' && (
                    <FormField
                      control={form.control}
                      name="refundPolicyType"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Policy Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-2 gap-2"
                            >
                              {['Exchange', 'Store Credit', 'Refund within 30 days', 'Other'].map((option) => (
                                <FormItem key={option} className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {form.watch('refundPolicyType') === 'Other' && (
                    <FormField
                      control={form.control}
                      name="otherRefundPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Other Refund Policy</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {/* Processing History */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Processing History</h3>
                  <FormField
                    control={form.control}
                    name="hasProcessingHistory"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Processing History?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        {field.value === 'Yes' && (
                          <p className="text-xs text-gray-500">Attach 3 most recent processing statements</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="previousProcessor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current/Previous Processor(s)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hasPreviousTerminations"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Previous Terminations?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('hasPreviousTerminations') === 'Yes' && (
                    <FormField
                      control={form.control}
                      name="terminationsExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Explain Previous Terminations</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="hasBankruptcies"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Bankruptcies?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('hasBankruptcies') === 'Yes' && (
                    <FormField
                      control={form.control}
                      name="bankruptciesExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Explain Bankruptcies</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {/* Business Type */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Business Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="b2bPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>B2B (%)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="b2cPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>B2C (%)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="isSeasonalBusiness"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Seasonal Business?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hasRecurringPayments"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Recurring Payments/Subscriptions?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('hasRecurringPayments') === 'Yes' && (
                    <FormField
                      control={form.control}
                      name="recurringPaymentsDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Recurring Payment Details</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </TabsContent>
              
              {/* eCommerce Tab */}
              <TabsContent value="ecommerce" className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> eCommerce & Card-Not-Present Information
                  </h3>
                  <p className="text-xs text-blue-700">
                    Complete details about your online sales and fulfillment processes.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">eCommerce / Card-Not-Present</h3>
                  <FormField
                    control={form.control}
                    name="productPurchaseAddresses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Purchase Address(es)</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inventoryOwner"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Who Owns Inventory?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Merchant', 'Vendor (Drop Ship)'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fulfillmentProviders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fulfillment Provider(s)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shoppingCartPlatforms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shopping Cart / CRM Platform(s)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Purchase Methods Checkboxes */}
                  <h4 className="text-sm font-medium pt-2">How Do Customers Purchase?</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {['In Person', 'Mail/Phone', 'Internet', 'Fax', 'Other'].map((option) => (
                      <FormItem key={option} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={form.watch('purchaseMethods')?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = form.watch('purchaseMethods') || [];
                              if (checked) {
                                form.setValue('purchaseMethods', [...current, option]);
                              } else {
                                form.setValue('purchaseMethods', current.filter(item => item !== option));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  
                  {form.watch('purchaseMethods')?.includes('Other') && (
                    <FormField
                      control={form.control}
                      name="otherPurchaseMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Other Purchase Method</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="callCenterProviders"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Call Center Provider(s)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="authToShipTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authorization to Shipment Timeframe</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0–7 days">0–7 days</SelectItem>
                              <SelectItem value="8–14 days">8–14 days</SelectItem>
                              <SelectItem value="15–30 days">15–30 days</SelectItem>
                              <SelectItem value="30–90 days">30–90 days</SelectItem>
                              <SelectItem value="90+ days">90+ days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deliveryTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Timeframe to Customer</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0–7 days">0–7 days</SelectItem>
                              <SelectItem value="8–14 days">8–14 days</SelectItem>
                              <SelectItem value="15–30 days">15–30 days</SelectItem>
                              <SelectItem value="30–90 days">30–90 days</SelectItem>
                              <SelectItem value="90+ days">90+ days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="chargebackSystem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chargeback Management System (if any)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requiresDeposits"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Deposits Required?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Yes', 'No'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('requiresDeposits') === 'Yes' && (
                    <FormField
                      control={form.control}
                      name="depositPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>% Required</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="paymentTiming"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>When is Full Payment Received?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-2"
                          >
                            {['100% Paid in Advance', '100% Paid on Delivery/Completion'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salesRegions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales Regions</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="internationalPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>% of International Transactions</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Shipping Methods Checkboxes */}
                  <h4 className="text-sm font-medium pt-2">Shipping Method</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['FedEx', 'UPS', 'USPS', 'Other'].map((option) => (
                      <FormItem key={option} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={form.watch('shippingMethods')?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = form.watch('shippingMethods') || [];
                              if (checked) {
                                form.setValue('shippingMethods', [...current, option]);
                              } else {
                                form.setValue('shippingMethods', current.filter(item => item !== option));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  
                  {form.watch('shippingMethods')?.includes('Other') && (
                    <FormField
                      control={form.control}
                      name="otherShippingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Other Shipping Method</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Advertising Channels Checkboxes */}
                  <h4 className="text-sm font-medium pt-2">Advertising Channels</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Catalog', 'TV/Radio', 'Flyers/Direct Mail', 'Internet', 'Other'].map((option) => (
                      <FormItem key={option} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={form.watch('advertisingChannels')?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = form.watch('advertisingChannels') || [];
                              if (checked) {
                                form.setValue('advertisingChannels', [...current, option]);
                              } else {
                                form.setValue('advertisingChannels', current.filter(item => item !== option));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  
                  {form.watch('advertisingChannels')?.includes('Other') && (
                    <FormField
                      control={form.control}
                      name="otherAdvertisingChannel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specify Other Advertising Channel</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="warrantyProvider"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Warranty / Guarantee Provided By</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['Merchant', 'Manufacturer'].map((option) => (
                              <FormItem key={option} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex space-x-2 items-center">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Pre-App PDF
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

