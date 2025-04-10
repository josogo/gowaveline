
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Industry, Lead } from './types';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface GeneratePdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: Industry;
  leads: Lead[];
}

interface MerchantApplicationFormData {
  // Business Structure
  businessStructure: string;
  businessStructureOther: string;
  
  // Business Information
  streetAddress: string;
  mailingAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessFax: string;
  customerServicePhone: string;
  customerServiceEmail: string;
  website: string;
  
  // Authorized Contact
  authorizedContactName: string;
  
  // Equipment/Software
  terminalGateway: string;
  shoppingCart: string;
  
  // Business Location
  numEmployees: string;
  locationType: string;
  ownRent: string;
  squareFootage: string;
  
  // Principal Information
  principalName: string;
  ownershipPercentage: string;
  hasAdditionalOwners: boolean;
  principalTitle: string;
  principalPhone: string;
  dateOfBirth: string;
  ssn: string;
  driversLicense: string;
  licenseExpDate: string;
  licenseState: string;
  homeAddress: string;
  personalEmail: string;
  
  // Bank Settlement
  bankName: string;
  bankContactName: string;
  routingNumber: string;
  accountNumber: string;
  
  // Business Description
  productsServices: string;
  yearsInOperation: string;
  storageLocation: string;
  
  // Processing Volume
  totalMonthlyVolume: string;
  visaMastercardVolume: string;
  amexVolume: string;
  averageTicket: string;
  highestTicket: string;
  
  // Transaction Method
  faceToFacePercent: string;
  motoPercent: string;
  ecommercePercent: string;
  
  // Refund/Cancellation
  hasRefundPolicy: string;
  policyType: string;
  policyTypeOther: string;
  processingHistory: string;
  previousProcessors: string;
  previousTerminations: string;
  terminationsExplanation: string;
  bankruptcies: string;
  bankruptciesExplanation: string;
  
  // Business Type
  b2bPercent: string;
  b2cPercent: string;
  isSeasonalBusiness: string;
  hasRecurringPayments: string;
  recurringPaymentsDetails: string;
  
  // eCommerce
  productPurchaseAddresses: string;
  inventoryOwner: string;
  fulfillmentProviders: string;
  shoppingCartPlatforms: string;
  purchaseMethods: string[];
  purchaseMethodOther: string;
  callCenterProviders: string;
  authToShipTimeframe: string;
  deliveryTimeframe: string;
  chargebackSystem: string;
  depositsRequired: string;
  depositPercentage: string;
  fullPaymentReceived: string;
  salesRegions: string;
  internationalTransactionPercent: string;
  shippingMethod: string[];
  shippingMethodOther: string;
  advertisingChannels: string[];
  advertisingChannelsOther: string;
  warrantyProvider: string;
}

const initialFormData: MerchantApplicationFormData = {
  // Initialize all fields with empty strings or default values
  businessStructure: '',
  businessStructureOther: '',
  streetAddress: '',
  mailingAddress: '',
  businessPhone: '',
  businessEmail: '',
  businessFax: '',
  customerServicePhone: '',
  customerServiceEmail: '',
  website: '',
  authorizedContactName: '',
  terminalGateway: '',
  shoppingCart: '',
  numEmployees: '',
  locationType: '',
  ownRent: '',
  squareFootage: '',
  principalName: '',
  ownershipPercentage: '',
  hasAdditionalOwners: false,
  principalTitle: '',
  principalPhone: '',
  dateOfBirth: '',
  ssn: '',
  driversLicense: '',
  licenseExpDate: '',
  licenseState: '',
  homeAddress: '',
  personalEmail: '',
  bankName: '',
  bankContactName: '',
  routingNumber: '',
  accountNumber: '',
  productsServices: '',
  yearsInOperation: '',
  storageLocation: '',
  totalMonthlyVolume: '',
  visaMastercardVolume: '',
  amexVolume: '',
  averageTicket: '',
  highestTicket: '',
  faceToFacePercent: '',
  motoPercent: '',
  ecommercePercent: '',
  hasRefundPolicy: '',
  policyType: '',
  policyTypeOther: '',
  processingHistory: '',
  previousProcessors: '',
  previousTerminations: '',
  terminationsExplanation: '',
  bankruptcies: '',
  bankruptciesExplanation: '',
  b2bPercent: '',
  b2cPercent: '',
  isSeasonalBusiness: '',
  hasRecurringPayments: '',
  recurringPaymentsDetails: '',
  productPurchaseAddresses: '',
  inventoryOwner: '',
  fulfillmentProviders: '',
  shoppingCartPlatforms: '',
  purchaseMethods: [],
  purchaseMethodOther: '',
  callCenterProviders: '',
  authToShipTimeframe: '',
  deliveryTimeframe: '',
  chargebackSystem: '',
  depositsRequired: '',
  depositPercentage: '',
  fullPaymentReceived: '',
  salesRegions: '',
  internationalTransactionPercent: '',
  shippingMethod: [],
  shippingMethodOther: '',
  advertisingChannels: [],
  advertisingChannelsOther: '',
  warrantyProvider: ''
};

export const GeneratePdfDialog: React.FC<GeneratePdfDialogProps> = ({ 
  open, 
  onOpenChange,
  industry,
  leads
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('blank');
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<MerchantApplicationFormData>(initialFormData);

  const handleInputChange = (field: keyof MerchantApplicationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof MerchantApplicationFormData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof MerchantApplicationFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = [...(prev[field] as string[] || [])];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    
    if (leadId === 'blank') {
      resetForm();
      return;
    }
    
    // Pre-fill form with lead data
    const selectedLead = leads.find(lead => lead.id.toString() === leadId);
    if (selectedLead) {
      setFormData(prev => ({
        ...prev,
        businessEmail: selectedLead.email || '',
        businessPhone: selectedLead.phone_number || '',
        website: selectedLead.website || '',
        totalMonthlyVolume: selectedLead.processing_volume || ''
      }));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      console.log("Starting PDF generation process");
      
      // Verify user is authenticated
      const { data, error: authError } = await supabase.auth.getSession();
      
      if (authError || !data.session) {
        console.error("Authentication error:", authError || "No active session found");
        toast.error("You must be logged in to generate a PDF. Please log in and try again.");
        setGenerating(false);
        return;
      }
      
      console.log("User authenticated:", data.session.user.id);
      
      let leadData = null;
      if (selectedLeadId !== 'blank') {
        const lead = leads.find(l => l.id.toString() === selectedLeadId);
        if (lead) {
          leadData = {
            businessName: lead.business_name,
            email: lead.email,
            phone: lead.phone_number,
            website: lead.website,
            processingVolume: lead.processing_volume
          };
          console.log("Using lead data:", leadData);
        }
      }

      console.log("Calling generate-pre-app function with:", { 
        industryId: industry.id,
        formData
      });

      // Call the edge function
      const { data: responseData, error } = await supabase.functions.invoke('generate-pre-app', {
        body: { 
          industryId: industry.id,
          formData
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || 'Failed to generate PDF');
      }
      
      console.log("Response from edge function:", responseData);
      
      if (!responseData || !responseData.pdfBase64) {
        console.error("Invalid response from edge function:", responseData);
        throw new Error('Invalid response from server');
      }

      console.log("PDF data received successfully, length:", responseData.pdfBase64.length);
      
      // Convert the data to a Blob
      const base64Data = responseData.pdfBase64;
      const binaryData = atob(base64Data);
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
      link.download = `${industry.name.replace(/\s+/g, '_')}_merchant_application.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      onOpenChange(false);
      toast.success('Merchant application generated successfully');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(error.message || 'Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Merchant Application</DialogTitle>
          <DialogDescription>
            Create a merchant application form for {industry?.name} industry
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-7">
            <TabsTrigger value="basic">1. Basic</TabsTrigger>
            <TabsTrigger value="business">2. Business</TabsTrigger>
            <TabsTrigger value="contact">3. Contact</TabsTrigger>
            <TabsTrigger value="processing">4. Processing</TabsTrigger>
            <TabsTrigger value="banking">5. Banking</TabsTrigger>
            <TabsTrigger value="operations">6. Operations</TabsTrigger>
            <TabsTrigger value="ecommerce">7. eCommerce</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-4 p-1">
              <div>
                <Label htmlFor="lead-select">Select a lead (optional)</Label>
                <Select value={selectedLeadId} onValueChange={handleLeadSelect}>
                  <SelectTrigger className="mt-2" id="lead-select">
                    <SelectValue placeholder="Select a lead to pre-fill data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Generate blank form</SelectItem>
                    {leads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  Select a lead to pre-fill the form with their information, or generate a blank form.
                </p>
              </div>
              
              <div className="flex p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />
                <p className="text-sm text-blue-800">
                  The generated application will include the industry template, comprehensive merchant information fields, and company logo (if available).
                </p>
              </div>
              
              <div>
                <Label>1. Business Structure</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sole-prop" checked={formData.businessStructure === 'Sole Proprietorship'} 
                      onCheckedChange={(checked) => handleInputChange('businessStructure', checked ? 'Sole Proprietorship' : '')} />
                    <label htmlFor="sole-prop" className="text-sm">Sole Proprietorship</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="corporation" checked={formData.businessStructure === 'Corporation'} 
                      onCheckedChange={(checked) => handleInputChange('businessStructure', checked ? 'Corporation' : '')} />
                    <label htmlFor="corporation" className="text-sm">Corporation</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="llc" checked={formData.businessStructure === 'LLC'} 
                      onCheckedChange={(checked) => handleInputChange('businessStructure', checked ? 'LLC' : '')} />
                    <label htmlFor="llc" className="text-sm">LLC</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nonprofit" checked={formData.businessStructure === 'Non-profit'} 
                      onCheckedChange={(checked) => handleInputChange('businessStructure', checked ? 'Non-profit' : '')} />
                    <label htmlFor="nonprofit" className="text-sm">Non-profit (401(c))</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="government" checked={formData.businessStructure === 'Government'} 
                      onCheckedChange={(checked) => handleInputChange('businessStructure', checked ? 'Government' : '')} />
                    <label htmlFor="government" className="text-sm">Government</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="other-structure" checked={formData.businessStructure === 'Other'} 
                      onCheckedChange={(checked) => handleInputChange('businessStructure', checked ? 'Other' : '')} />
                    <label htmlFor="other-structure" className="text-sm">Other</label>
                  </div>
                </div>
                {formData.businessStructure === 'Other' && (
                  <Input 
                    className="mt-2"
                    placeholder="Please specify"
                    value={formData.businessStructureOther}
                    onChange={(e) => handleInputChange('businessStructureOther', e.target.value)}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4 p-1">
              {/* Business Information fields, mimicking the PreAppGenerationDialog */}
              <div>
                <Label htmlFor="street-address">Street (Location) Address</Label>
                <Input
                  id="street-address"
                  className="mt-2" 
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="mailing-address">Mailing (Legal) Address</Label>
                <Input
                  id="mailing-address"
                  className="mt-2" 
                  value={formData.mailingAddress}
                  onChange={(e) => handleInputChange('mailingAddress', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-phone">Business/Contact Telephone</Label>
                  <Input
                    id="business-phone"
                    className="mt-2" 
                    value={formData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="business-email">Business/Contact Email</Label>
                  <Input
                    id="business-email"
                    className="mt-2" 
                    value={formData.businessEmail}
                    onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="business-fax">Business Fax #</Label>
                  <Input
                    id="business-fax"
                    className="mt-2" 
                    value={formData.businessFax}
                    onChange={(e) => handleInputChange('businessFax', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cs-phone">Customer Service Telephone</Label>
                  <Input
                    id="cs-phone"
                    className="mt-2" 
                    value={formData.customerServicePhone}
                    onChange={(e) => handleInputChange('customerServicePhone', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cs-email">Customer Service Email</Label>
                  <Input
                    id="cs-email"
                    className="mt-2" 
                    value={formData.customerServiceEmail}
                    onChange={(e) => handleInputChange('customerServiceEmail', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website/URL</Label>
                  <Input
                    id="website"
                    className="mt-2" 
                    placeholder="http://"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="auth-contact">Authorized Contact Full Name</Label>
                <Input
                  id="auth-contact"
                  className="mt-2" 
                  value={formData.authorizedContactName}
                  onChange={(e) => handleInputChange('authorizedContactName', e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 p-1">
              {/* Additional tabs with all form fields from PreAppGenerationDialog */}
              <div>
                <Label>Principal Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="principal-name" className="text-sm">Full Name</Label>
                    <Input
                      id="principal-name"
                      className="mt-2" 
                      value={formData.principalName}
                      onChange={(e) => handleInputChange('principalName', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <Label htmlFor="ownership-pct" className="text-sm">Ownership %</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="ownership-pct"
                        className="mt-2" 
                        value={formData.ownershipPercentage}
                        onChange={(e) => handleInputChange('ownershipPercentage', e.target.value)}
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox 
                          id="additional-owners" 
                          checked={formData.hasAdditionalOwners}
                          onCheckedChange={(checked) => handleCheckboxChange('hasAdditionalOwners', checked as boolean)}
                        />
                        <label htmlFor="additional-owners" className="text-xs">Additional owners 25%+</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Principal Information fields */}
                  <div>
                    <Label htmlFor="principal-title" className="text-sm">Title (Owner, CEO, etc.)</Label>
                    <Input
                      id="principal-title"
                      className="mt-2" 
                      value={formData.principalTitle}
                      onChange={(e) => handleInputChange('principalTitle', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="principal-phone" className="text-sm">Home Telephone</Label>
                    <Input
                      id="principal-phone"
                      className="mt-2" 
                      value={formData.principalPhone}
                      onChange={(e) => handleInputChange('principalPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Business Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="num-employees" className="text-sm">Number of Employees</Label>
                    <Input
                      id="num-employees"
                      className="mt-2" 
                      value={formData.numEmployees}
                      onChange={(e) => handleInputChange('numEmployees', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Location Type</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="home-loc" checked={formData.locationType === 'Home/Residential'} 
                          onCheckedChange={(checked) => handleInputChange('locationType', checked ? 'Home/Residential' : '')} />
                        <label htmlFor="home-loc" className="text-sm">Home/Residential</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="office-loc" checked={formData.locationType === 'Office/Business District'} 
                          onCheckedChange={(checked) => handleInputChange('locationType', checked ? 'Office/Business District' : '')} />
                        <label htmlFor="office-loc" className="text-sm">Office/Business District</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="storefront-loc" checked={formData.locationType === 'Storefront'} 
                          onCheckedChange={(checked) => handleInputChange('locationType', checked ? 'Storefront' : '')} />
                        <label htmlFor="storefront-loc" className="text-sm">Storefront</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Equipment / Software</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="terminal-gateway" className="text-sm">Terminal/Gateway Used (e.g., VX 520, Authorize.net, NMI)</Label>
                    <Input
                      id="terminal-gateway"
                      className="mt-2" 
                      value={formData.terminalGateway}
                      onChange={(e) => handleInputChange('terminalGateway', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shopping-cart" className="text-sm">Shopping Cart (if applicable)</Label>
                    <Input
                      id="shopping-cart"
                      className="mt-2" 
                      value={formData.shoppingCart}
                      onChange={(e) => handleInputChange('shoppingCart', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">If using Shopify, request Authorize.net Gateway.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Add the remaining tabs with relevant form fields */}
            <TabsContent value="processing" className="space-y-4 p-1">
              {/* Processing Volume fields */}
              <div>
                <Label>Processing Volume</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="total-volume" className="text-sm">Estimated Total Monthly Volume</Label>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">$</span>
                      <Input
                        id="total-volume"
                        value={formData.totalMonthlyVolume}
                        onChange={(e) => handleInputChange('totalMonthlyVolume', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="visa-mc-volume" className="text-sm">Visa/Mastercard Volume</Label>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">$</span>
                      <Input
                        id="visa-mc-volume"
                        value={formData.visaMastercardVolume}
                        onChange={(e) => handleInputChange('visaMastercardVolume', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Transaction Method (Must Equal 100%)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="face-to-face" className="text-sm">Face-to-Face (Retail)</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="face-to-face"
                        value={formData.faceToFacePercent}
                        onChange={(e) => handleInputChange('faceToFacePercent', e.target.value)}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="moto" className="text-sm">Telephone/Mail/Email (MOTO)</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="moto"
                        value={formData.motoPercent}
                        onChange={(e) => handleInputChange('motoPercent', e.target.value)}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="ecommerce" className="text-sm">Internet (eCommerce)</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="ecommerce"
                        value={formData.ecommercePercent}
                        onChange={(e) => handleInputChange('ecommercePercent', e.target.value)}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="banking" className="space-y-4 p-1">
              {/* Banking Information fields */}
              <div>
                <Label>Bank Settlement Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="bank-name" className="text-sm">Bank Name</Label>
                    <Input
                      id="bank-name"
                      className="mt-2" 
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bank-contact" className="text-sm">Contact Name at Bank</Label>
                    <Input
                      id="bank-contact"
                      className="mt-2" 
                      value={formData.bankContactName}
                      onChange={(e) => handleInputChange('bankContactName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="routing" className="text-sm">Routing Number</Label>
                    <Input
                      id="routing"
                      className="mt-2" 
                      value={formData.routingNumber}
                      onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="account" className="text-sm">Account Number</Label>
                    <Input
                      id="account"
                      className="mt-2" 
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="operations" className="space-y-4 p-1">
              {/* Business Description fields */}
              <div>
                <Label>Business Description</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="products-services" className="text-sm">Products/Services Sold</Label>
                    <Input
                      id="products-services"
                      className="mt-2" 
                      value={formData.productsServices}
                      onChange={(e) => handleInputChange('productsServices', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="years-operation" className="text-sm">Years in Operation</Label>
                    <Input
                      id="years-operation"
                      className="mt-2" 
                      value={formData.yearsInOperation}
                      onChange={(e) => handleInputChange('yearsInOperation', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Business Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="b2b" className="text-sm">B2B</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="b2b"
                        value={formData.b2bPercent}
                        onChange={(e) => handleInputChange('b2bPercent', e.target.value)}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="b2c" className="text-sm">B2C</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="b2c"
                        value={formData.b2cPercent}
                        onChange={(e) => handleInputChange('b2cPercent', e.target.value)}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ecommerce" className="space-y-4 p-1">
              {/* eCommerce fields */}
              <div>
                <Label>eCommerce / Card-Not-Present Details</Label>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  <div>
                    <Label htmlFor="product-addresses" className="text-sm">Product Purchase Address(es)</Label>
                    <Textarea
                      id="product-addresses"
                      className="mt-2" 
                      value={formData.productPurchaseAddresses}
                      onChange={(e) => handleInputChange('productPurchaseAddresses', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Who Owns Inventory?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="merchant-inventory" checked={formData.inventoryOwner === 'Merchant'} 
                          onCheckedChange={(checked) => handleInputChange('inventoryOwner', checked ? 'Merchant' : '')} />
                        <label htmlFor="merchant-inventory" className="text-sm">Merchant</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vendor-inventory" checked={formData.inventoryOwner === 'Vendor (Drop Ship)'} 
                          onCheckedChange={(checked) => handleInputChange('inventoryOwner', checked ? 'Vendor (Drop Ship)' : '')} />
                        <label htmlFor="vendor-inventory" className="text-sm">Vendor (Drop Ship)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={generating}
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
          >
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Merchant Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
