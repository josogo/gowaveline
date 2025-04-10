
import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Industry, Lead } from '../industries/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface MerchantApplicationFormData {
  // Business Structure
  businessStructure: 'sole_proprietorship' | 'corporation' | 'llc' | 'non_profit' | 'government' | 'other';
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
  
  // Equipment / Software
  terminalGateway: string;
  shoppingCart: string;
  
  // Business Location
  employeeCount: string;
  locationType: 'home' | 'office' | 'storefront';
  ownOrRent: 'own' | 'rent';
  squareFootage: '0-500' | '501-2000' | '2001-5000' | '5000+';
  
  // Principal Information
  principalName: string;
  ownershipPercentage: string;
  additionalOwners: boolean;
  principalTitle: string;
  principalPhone: string;
  dateOfBirthMonth: string;
  dateOfBirthDay: string;
  dateOfBirthYear: string;
  ssn: string;
  driversLicense: string;
  licenseExpMonth: string;
  licenseExpDay: string;
  licenseExpYear: string;
  licenseState: string;
  principalAddress: string;
  principalEmail: string;
  
  // Bank Settlement Information
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
  faceToFacePercentage: string;
  motoPercentage: string;
  ecommercePercentage: string;
  
  // Refund / Cancellation Policy
  hasRefundPolicy: boolean;
  policyType: 'exchange' | 'store_credit' | 'refund_30_days' | 'other';
  policyTypeOther: string;
  hasProcessingHistory: boolean;
  currentPreviousProcessors: string;
  hasPreviousTerminations: boolean;
  terminationsExplanation: string;
  hasBankruptcies: boolean;
  bankruptciesExplanation: string;
  
  // Business Type
  b2bPercentage: string;
  b2cPercentage: string;
  isSeasonalBusiness: boolean;
  hasRecurringPayments: boolean;
  recurringPaymentsDetails: string;
  
  // eCommerce / Card-Not-Present
  productPurchaseAddresses: string;
  inventoryOwnership: 'merchant' | 'vendor';
  fulfillmentProviders: string;
  shoppingCartPlatforms: string;
  purchaseMethods: ('in_person' | 'mail_phone' | 'internet' | 'fax' | 'other')[];
  purchaseMethodsOther: string;
  callCenterProviders: string;
  authToShipTimeframe: '0-7' | '8-14' | '15-30' | '30-90' | '90+';
  deliveryTimeframe: '0-7' | '8-14' | '15-30' | '30-90' | '90+';
  chargebackManagement: string;
  depositsRequired: boolean;
  depositPercentage: string;
  fullPaymentTiming: 'advance' | 'delivery';
  salesRegions: string;
  internationalTransactionsPercentage: string;
  shippingMethod: ('fedex' | 'ups' | 'usps' | 'other')[];
  shippingMethodOther: string;
  advertisingChannels: ('catalog' | 'tv_radio' | 'flyers' | 'internet' | 'other')[];
  advertisingChannelsOther: string;
  warrantyProvider: 'merchant' | 'manufacturer';
}

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('blank');
  const [generating, setGenerating] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('business');
  
  const form = useForm<MerchantApplicationFormData>({
    defaultValues: {
      businessStructure: 'sole_proprietorship',
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
      employeeCount: '',
      locationType: 'office',
      ownOrRent: 'own',
      squareFootage: '0-500',
      principalName: '',
      ownershipPercentage: '',
      additionalOwners: false,
      principalTitle: '',
      principalPhone: '',
      dateOfBirthMonth: '',
      dateOfBirthDay: '',
      dateOfBirthYear: '',
      ssn: '',
      driversLicense: '',
      licenseExpMonth: '',
      licenseExpDay: '',
      licenseExpYear: '',
      licenseState: '',
      principalAddress: '',
      principalEmail: '',
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
      faceToFacePercentage: '',
      motoPercentage: '',
      ecommercePercentage: '',
      hasRefundPolicy: false,
      policyType: 'exchange',
      policyTypeOther: '',
      hasProcessingHistory: false,
      currentPreviousProcessors: '',
      hasPreviousTerminations: false,
      terminationsExplanation: '',
      hasBankruptcies: false,
      bankruptciesExplanation: '',
      b2bPercentage: '',
      b2cPercentage: '',
      isSeasonalBusiness: false,
      hasRecurringPayments: false,
      recurringPaymentsDetails: '',
      productPurchaseAddresses: '',
      inventoryOwnership: 'merchant',
      fulfillmentProviders: '',
      shoppingCartPlatforms: '',
      purchaseMethods: ['in_person'],
      purchaseMethodsOther: '',
      callCenterProviders: '',
      authToShipTimeframe: '0-7',
      deliveryTimeframe: '0-7',
      chargebackManagement: '',
      depositsRequired: false,
      depositPercentage: '',
      fullPaymentTiming: 'advance',
      salesRegions: '',
      internationalTransactionsPercentage: '',
      shippingMethod: ['usps'],
      shippingMethodOther: '',
      advertisingChannels: ['internet'],
      advertisingChannelsOther: '',
      warrantyProvider: 'merchant',
    }
  });

  // Fetch industries and leads when the dialog opens
  useEffect(() => {
    if (open) {
      fetchIndustries();
      fetchLeads();
    }
  }, [open]);

  // Fetch industries
  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setIndustries(data || []);
      if (data && data.length > 0) {
        setSelectedIndustryId(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching industries:', error);
      toast.error('Failed to load industries');
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('business_name', { ascending: true });
      
      if (error) throw error;
      
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    }
  };

  const handleGenerate = async () => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    setGenerating(true);

    try {
      console.log("Starting PDF generation process");
      
      // Get form data
      const formData = form.getValues();
      
      // Verify user is authenticated
      const { data, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error("Authentication error:", authError);
        toast.error("Authentication error. Please log in and try again.");
        setGenerating(false);
        return;
      }
      
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
        industryId: selectedIndustryId,
        leadData,
        formData 
      });

      // Call the edge function
      const { data: responseData, error } = await supabase.functions.invoke('generate-pre-app', {
        body: { 
          industryId: selectedIndustryId,
          leadData,
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
      const industryName = industries.find(i => i.id === selectedIndustryId)?.name || 'industry';
      link.download = `WaveLine_${industryName.replace(/\s+/g, '_')}_application.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      onSuccess();
      onOpenChange(false);
      toast.success('PDF generated successfully');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(error.message || 'Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  // Handle lead selection
  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    
    if (leadId !== 'blank') {
      const lead = leads.find(l => l.id.toString() === leadId);
      if (lead) {
        form.setValue('businessEmail', lead.email || '');
        form.setValue('businessPhone', lead.phone_number || '');
        form.setValue('website', lead.website || '');
        
        // If we have a business name, set it as the authorized contact name
        if (lead.business_name) {
          form.setValue('authorizedContactName', lead.business_name);
        }
      }
    }
  };

  const nextTab = () => {
    if (activeTab === 'business') setActiveTab('location');
    else if (activeTab === 'location') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('processing');
    else if (activeTab === 'processing') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('ecommerce');
  };

  const prevTab = () => {
    if (activeTab === 'location') setActiveTab('business');
    else if (activeTab === 'principal') setActiveTab('location');
    else if (activeTab === 'banking') setActiveTab('principal');
    else if (activeTab === 'processing') setActiveTab('banking');
    else if (activeTab === 'policies') setActiveTab('processing');
    else if (activeTab === 'ecommerce') setActiveTab('policies');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">WaveLine Merchant Application</DialogTitle>
          <DialogDescription>
            Fill out the merchant application form information
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industry Selection */}
              <div>
                <Label htmlFor="industry-select">Select Industry</Label>
                <Select 
                  value={selectedIndustryId} 
                  onValueChange={setSelectedIndustryId}
                >
                  <SelectTrigger className="mt-2" id="industry-select">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Lead Selection */}
              <div>
                <Label htmlFor="lead-select">Select a lead (optional)</Label>
                <Select value={selectedLeadId} onValueChange={handleLeadSelect}>
                  <SelectTrigger className="mt-2" id="lead-select">
                    <SelectValue placeholder="Select a lead to pre-fill data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Use blank form</SelectItem>
                    {leads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-7">
              <TabsTrigger value="business">Business Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="principal">Principal</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1 mt-4 px-1">
              <form className="space-y-4">
                {/* Business Information Tab */}
                <TabsContent value="business" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">1. Business Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Business Type</Label>
                        <RadioGroup 
                          defaultValue={form.getValues('businessStructure')}
                          onValueChange={(value) => form.setValue('businessStructure', value as any)}
                          className="grid grid-cols-2 gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sole_proprietorship" id="sole_prop" />
                            <Label htmlFor="sole_prop">Sole Proprietorship</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="corporation" id="corp" />
                            <Label htmlFor="corp">Corporation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="llc" id="llc" />
                            <Label htmlFor="llc">LLC</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non_profit" id="non_profit" />
                            <Label htmlFor="non_profit">Non-profit (401(c))</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="government" id="govt" />
                            <Label htmlFor="govt">Government</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other_structure" />
                            <Label htmlFor="other_structure">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {form.getValues('businessStructure') === 'other' && (
                        <div>
                          <Label>Other (please specify)</Label>
                          <Input 
                            {...form.register('businessStructureOther')}
                            placeholder="Please specify"
                          />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg">2. Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street-address">Street (Location) Address</Label>
                        <Input
                          id="street-address"
                          {...form.register('streetAddress')}
                          placeholder="123 Business St"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mailing-address">Mailing (Legal) Address</Label>
                        <Input
                          id="mailing-address"
                          {...form.register('mailingAddress')}
                          placeholder="123 Legal Ave"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-phone">Business/Contact Telephone</Label>
                        <Input
                          id="business-phone"
                          {...form.register('businessPhone')}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-email">Business/Contact Email</Label>
                        <Input
                          id="business-email"
                          {...form.register('businessEmail')}
                          placeholder="contact@business.com"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-fax">Business Fax #</Label>
                        <Input
                          id="business-fax"
                          {...form.register('businessFax')}
                          placeholder="(555) 123-4568"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cs-phone">Customer Service Telephone</Label>
                        <Input
                          id="cs-phone"
                          {...form.register('customerServicePhone')}
                          placeholder="(555) 123-4569"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cs-email">Customer Service Email</Label>
                        <Input
                          id="cs-email"
                          {...form.register('customerServiceEmail')}
                          placeholder="support@business.com"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website/URL</Label>
                        <Input
                          id="website"
                          {...form.register('website')}
                          placeholder="https://www.business.com"
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg">3. Authorized Contact</h3>
                    <div>
                      <Label htmlFor="auth-contact">Full Name</Label>
                      <Input
                        id="auth-contact"
                        {...form.register('authorizedContactName')}
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-lg">4. Equipment / Software</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="terminal">Terminal/Gateway Used</Label>
                        <Input
                          id="terminal"
                          {...form.register('terminalGateway')}
                          placeholder="VX 520, Authorize.net, NMI"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shopping-cart">Shopping Cart (if applicable)</Label>
                        <Input
                          id="shopping-cart"
                          {...form.register('shoppingCart')}
                          placeholder="Shopify, WooCommerce, etc."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab}>Next</Button>
                  </div>
                </TabsContent>
                
                {/* Location Tab */}
                <TabsContent value="location" className="space-y-4">
                  <h3 className="font-semibold text-lg">5. Business Location</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employee-count">Number of Employees</Label>
                      <Input
                        id="employee-count"
                        {...form.register('employeeCount')}
                        placeholder="5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Location Type</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('locationType')}
                        onValueChange={(value) => form.setValue('locationType', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home">Home/Residential</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office">Office/Business District</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="storefront" id="storefront" />
                          <Label htmlFor="storefront">Storefront</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Own or Rent</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('ownOrRent')}
                        onValueChange={(value) => form.setValue('ownOrRent', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="own" id="own" />
                          <Label htmlFor="own">Own</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rent" id="rent" />
                          <Label htmlFor="rent">Rent</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Approx. Square Footage</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('squareFootage')}
                        onValueChange={(value) => form.setValue('squareFootage', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-500" id="sq1" />
                          <Label htmlFor="sq1">0–500 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="501-2000" id="sq2" />
                          <Label htmlFor="sq2">501–2,000 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2001-5000" id="sq3" />
                          <Label htmlFor="sq3">2,001–5,000 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5000+" id="sq4" />
                          <Label htmlFor="sq4">5,000+ ft²</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>
                    <Button type="button" onClick={nextTab}>Next</Button>
                  </div>
                </TabsContent>
                
                {/* Principal Tab */}
                <TabsContent value="principal" className="space-y-4">
                  <h3 className="font-semibold text-lg">6. Principal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="principal-name">Full Name</Label>
                      <Input
                        id="principal-name"
                        {...form.register('principalName')}
                        placeholder="Jane Smith"
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor="ownership">Ownership %</Label>
                        <Input
                          id="ownership"
                          {...form.register('ownershipPercentage')}
                          placeholder="100"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id="additional-owners"
                          checked={form.getValues('additionalOwners')}
                          onCheckedChange={(checked) => form.setValue('additionalOwners', checked === true)}
                        />
                        <Label htmlFor="additional-owners">Additional owners have 25%+</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="principal-title">Title (Owner, CEO, etc.)</Label>
                      <Input
                        id="principal-title"
                        {...form.register('principalTitle')}
                        placeholder="CEO"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="principal-phone">Home Telephone</Label>
                      <Input
                        id="principal-phone"
                        {...form.register('principalPhone')}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          id="dob-month"
                          {...form.register('dateOfBirthMonth')}
                          placeholder="MM"
                          maxLength={2}
                        />
                        <Input
                          id="dob-day"
                          {...form.register('dateOfBirthDay')}
                          placeholder="DD"
                          maxLength={2}
                        />
                        <Input
                          id="dob-year"
                          {...form.register('dateOfBirthYear')}
                          placeholder="YYYY"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="ssn">SSN</Label>
                      <Input
                        id="ssn"
                        {...form.register('ssn')}
                        placeholder="XXX-XX-XXXX"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="drivers-license">Driver's License #</Label>
                      <Input
                        id="drivers-license"
                        {...form.register('driversLicense')}
                        placeholder="DL12345678"
                      />
                    </div>
                    
                    <div>
                      <Label>License Expiration Date</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          {...form.register('licenseExpMonth')}
                          placeholder="MM"
                          maxLength={2}
                        />
                        <Input
                          {...form.register('licenseExpDay')}
                          placeholder="DD"
                          maxLength={2}
                        />
                        <Input
                          {...form.register('licenseExpYear')}
                          placeholder="YYYY"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="license-state">State</Label>
                      <Input
                        id="license-state"
                        {...form.register('licenseState')}
                        placeholder="CA"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="principal-address">Home Address</Label>
                      <Input
                        id="principal-address"
                        {...form.register('principalAddress')}
                        placeholder="123 Home St, City, State ZIP"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="principal-email">Personal Email</Label>
                      <Input
                        id="principal-email"
                        {...form.register('principalEmail')}
                        placeholder="jane@example.com"
                        type="email"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>
                    <Button type="button" onClick={nextTab}>Next</Button>
                  </div>
                </TabsContent>
                
                {/* Banking Tab */}
                <TabsContent value="banking" className="space-y-4">
                  <h3 className="font-semibold text-lg">7. Bank Settlement Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        {...form.register('bankName')}
                        placeholder="First National Bank"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bank-contact">Contact Name at Bank</Label>
                      <Input
                        id="bank-contact"
                        {...form.register('bankContactName')}
                        placeholder="John Banker"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="routing-number">Routing Number</Label>
                      <Input
                        id="routing-number"
                        {...form.register('routingNumber')}
                        placeholder="123456789"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        {...form.register('accountNumber')}
                        placeholder="987654321"
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg">8. Business Description</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="products-services">Products/Services Sold</Label>
                      <Input
                        id="products-services"
                        {...form.register('productsServices')}
                        placeholder="Describe products or services"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="years-operation">Years in Operation</Label>
                      <Input
                        id="years-operation"
                        {...form.register('yearsInOperation')}
                        placeholder="5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="storage-location">Storage Location (if applicable)</Label>
                      <Input
                        id="storage-location"
                        {...form.register('storageLocation')}
                        placeholder="123 Warehouse Ave"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>
                    <Button type="button" onClick={nextTab}>Next</Button>
                  </div>
                </TabsContent>
                
                {/* Processing Tab */}
                <TabsContent value="processing" className="space-y-4">
                  <h3 className="font-semibold text-lg">9. Processing Volume</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="total-volume">Estimated Total Monthly Volume</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <Input
                          id="total-volume"
                          {...form.register('totalMonthlyVolume')}
                          placeholder="10,000"
                          className="pl-7"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="visa-mc-volume">Visa/Mastercard Volume</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <Input
                          id="visa-mc-volume"
                          {...form.register('visaMastercardVolume')}
                          placeholder="8,000"
                          className="pl-7"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="amex-volume">American Express Volume</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <Input
                          id="amex-volume"
                          {...form.register('amexVolume')}
                          placeholder="2,000"
                          className="pl-7"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="avg-ticket">Average Ticket</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <Input
                          id="avg-ticket"
                          {...form.register('averageTicket')}
                          placeholder="100"
                          className="pl-7"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="highest-ticket">Highest Ticket</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <Input
                          id="highest-ticket"
                          {...form.register('highestTicket')}
                          placeholder="500"
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg">10. Transaction Method (Must Equal 100%)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="face-to-face">Face-to-Face (Retail)</Label>
                      <div className="relative">
                        <Input
                          id="face-to-face"
                          {...form.register('faceToFacePercentage')}
                          placeholder="30"
                          className="pr-7"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="moto">Telephone/Mail/Email (MOTO)</Label>
                      <div className="relative">
                        <Input
                          id="moto"
                          {...form.register('motoPercentage')}
                          placeholder="20"
                          className="pr-7"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="ecommerce">Internet (eCommerce)</Label>
                      <div className="relative">
                        <Input
                          id="ecommerce"
                          {...form.register('ecommercePercentage')}
                          placeholder="50"
                          className="pr-7"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>
                    <Button type="button" onClick={nextTab}>Next</Button>
                  </div>
                </TabsContent>
                
                {/* Policies Tab */}
                <TabsContent value="policies" className="space-y-4">
                  <h3 className="font-semibold text-lg">11. Refund / Cancellation Policy</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="refund-policy"
                        checked={form.getValues('hasRefundPolicy')}
                        onCheckedChange={(checked) => form.setValue('hasRefundPolicy', checked === true)}
                      />
                      <Label htmlFor="refund-policy">Do you have a refund policy?</Label>
                    </div>
                    
                    {form.getValues('hasRefundPolicy') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Policy Type</Label>
                          <RadioGroup 
                            defaultValue={form.getValues('policyType')}
                            onValueChange={(value) => form.setValue('policyType', value as any)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="exchange" id="exchange" />
                              <Label htmlFor="exchange">Exchange</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="store_credit" id="store_credit" />
                              <Label htmlFor="store_credit">Store Credit</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="refund_30_days" id="refund_30_days" />
                              <Label htmlFor="refund_30_days">Refund within 30 days</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other_policy" />
                              <Label htmlFor="other_policy">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {form.getValues('policyType') === 'other' && (
                          <div>
                            <Label htmlFor="policy-other">Other Policy Type</Label>
                            <Input
                              id="policy-other"
                              {...form.register('policyTypeOther')}
                              placeholder="Please specify"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="processing-history"
                        checked={form.getValues('hasProcessingHistory')}
                        onCheckedChange={(checked) => form.setValue('hasProcessingHistory', checked === true)}
                      />
                      <Label htmlFor="processing-history">Processing History?</Label>
                    </div>
                    
                    {form.getValues('hasProcessingHistory') && (
                      <div>
                        <Label htmlFor="previous-processors">Current/Previous Processor(s)</Label>
                        <Input
                          id="previous-processors"
                          {...form.register('currentPreviousProcessors')}
                          placeholder="List processors"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="previous-terminations"
                            checked={form.getValues('hasPreviousTerminations')}
                            onCheckedChange={(checked) => form.setValue('hasPreviousTerminations', checked === true)}
                          />
                          <Label htmlFor="previous-terminations">Previous Terminations?</Label>
                        </div>
                        
                        {form.getValues('hasPreviousTerminations') && (
                          <div className="mt-2">
                            <Label htmlFor="terminations-explanation">Explanation</Label>
                            <Textarea
                              id="terminations-explanation"
                              {...form.register('terminationsExplanation')}
                              placeholder="Please explain"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bankruptcies"
                            checked={form.getValues('hasBankruptcies')}
                            onCheckedChange={(checked) => form.setValue('hasBankruptcies', checked === true)}
                          />
                          <Label htmlFor="bankruptcies">Bankruptcies?</Label>
                        </div>
                        
                        {form.getValues('hasBankruptcies') && (
                          <div className="mt-2">
                            <Label htmlFor="bankruptcies-explanation">Explanation</Label>
                            <Textarea
                              id="bankruptcies-explanation"
                              {...form.register('bankruptciesExplanation')}
                              placeholder="Please explain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg">12. Business Type</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="b2b">B2B (%)</Label>
                      <div className="relative">
                        <Input
                          id="b2b"
                          {...form.register('b2bPercentage')}
                          placeholder="30"
                          className="pr-7"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="b2c">B2C (%)</Label>
                      <div className="relative">
                        <Input
                          id="b2c"
                          {...form.register('b2cPercentage')}
                          placeholder="70"
                          className="pr-7"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="seasonal-business"
                        checked={form.getValues('isSeasonalBusiness')}
                        onCheckedChange={(checked) => form.setValue('isSeasonalBusiness', checked === true)}
                      />
                      <Label htmlFor="seasonal-business">Seasonal Business?</Label>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="recurring-payments"
                          checked={form.getValues('hasRecurringPayments')}
                          onCheckedChange={(checked) => form.setValue('hasRecurringPayments', checked === true)}
                        />
                        <Label htmlFor="recurring-payments">Recurring Payments/Subscriptions?</Label>
                      </div>
                      
                      {form.getValues('hasRecurringPayments') && (
                        <div className="mt-2">
                          <Label htmlFor="recurring-details">Specify Details</Label>
                          <Textarea
                            id="recurring-details"
                            {...form.register('recurringPaymentsDetails')}
                            placeholder="Please specify details"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>
                    <Button type="button" onClick={nextTab}>Next</Button>
                  </div>
                </TabsContent>
                
                {/* E-Commerce Tab */}
                <TabsContent value="ecommerce" className="space-y-4">
                  <h3 className="font-semibold text-lg">13. eCommerce / Card-Not-Present</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="purchase-addresses">Product Purchase Address(es)</Label>
                      <Input
                        id="purchase-addresses"
                        {...form.register('productPurchaseAddresses')}
                        placeholder="List addresses"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Who Owns Inventory?</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('inventoryOwnership')}
                        onValueChange={(value) => form.setValue('inventoryOwnership', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merchant" id="merchant_inventory" />
                          <Label htmlFor="merchant_inventory">Merchant</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vendor" id="vendor_inventory" />
                          <Label htmlFor="vendor_inventory">Vendor (Drop Ship)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="fulfillment-providers">Fulfillment Provider(s)</Label>
                      <Input
                        id="fulfillment-providers"
                        {...form.register('fulfillmentProviders')}
                        placeholder="List providers"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shopping-cart-platforms">Shopping Cart / CRM Platform(s)</Label>
                      <Input
                        id="shopping-cart-platforms"
                        {...form.register('shoppingCartPlatforms')}
                        placeholder="Shopify, WooCommerce, etc."
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>How Do Customers Purchase?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purchase-in-person"
                            checked={form.getValues('purchaseMethods').includes('in_person')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('purchaseMethods');
                              if (checked) {
                                form.setValue('purchaseMethods', [...methods, 'in_person']);
                              } else {
                                form.setValue('purchaseMethods', methods.filter(m => m !== 'in_person'));
                              }
                            }}
                          />
                          <Label htmlFor="purchase-in-person">In Person</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purchase-mail-phone"
                            checked={form.getValues('purchaseMethods').includes('mail_phone')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('purchaseMethods');
                              if (checked) {
                                form.setValue('purchaseMethods', [...methods, 'mail_phone']);
                              } else {
                                form.setValue('purchaseMethods', methods.filter(m => m !== 'mail_phone'));
                              }
                            }}
                          />
                          <Label htmlFor="purchase-mail-phone">Mail/Phone</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purchase-internet"
                            checked={form.getValues('purchaseMethods').includes('internet')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('purchaseMethods');
                              if (checked) {
                                form.setValue('purchaseMethods', [...methods, 'internet']);
                              } else {
                                form.setValue('purchaseMethods', methods.filter(m => m !== 'internet'));
                              }
                            }}
                          />
                          <Label htmlFor="purchase-internet">Internet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purchase-fax"
                            checked={form.getValues('purchaseMethods').includes('fax')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('purchaseMethods');
                              if (checked) {
                                form.setValue('purchaseMethods', [...methods, 'fax']);
                              } else {
                                form.setValue('purchaseMethods', methods.filter(m => m !== 'fax'));
                              }
                            }}
                          />
                          <Label htmlFor="purchase-fax">Fax</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="purchase-other"
                            checked={form.getValues('purchaseMethods').includes('other')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('purchaseMethods');
                              if (checked) {
                                form.setValue('purchaseMethods', [...methods, 'other']);
                              } else {
                                form.setValue('purchaseMethods', methods.filter(m => m !== 'other'));
                              }
                            }}
                          />
                          <Label htmlFor="purchase-other">Other</Label>
                        </div>
                      </div>
                    </div>
                    
                    {form.getValues('purchaseMethods').includes('other') && (
                      <div>
                        <Label htmlFor="purchase-other-specify">Other Purchase Method</Label>
                        <Input
                          id="purchase-other-specify"
                          {...form.register('purchaseMethodsOther')}
                          placeholder="Please specify"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="call-center-providers">Call Center Provider(s)</Label>
                      <Input
                        id="call-center-providers"
                        {...form.register('callCenterProviders')}
                        placeholder="List providers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Authorization to Shipment Timeframe</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('authToShipTimeframe')}
                        onValueChange={(value) => form.setValue('authToShipTimeframe', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-7" id="auth_ship_1" />
                          <Label htmlFor="auth_ship_1">0–7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="8-14" id="auth_ship_2" />
                          <Label htmlFor="auth_ship_2">8–14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15-30" id="auth_ship_3" />
                          <Label htmlFor="auth_ship_3">15–30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-90" id="auth_ship_4" />
                          <Label htmlFor="auth_ship_4">30–90 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90+" id="auth_ship_5" />
                          <Label htmlFor="auth_ship_5">90+ days</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Delivery Timeframe to Customer</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('deliveryTimeframe')}
                        onValueChange={(value) => form.setValue('deliveryTimeframe', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-7" id="delivery_1" />
                          <Label htmlFor="delivery_1">0–7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="8-14" id="delivery_2" />
                          <Label htmlFor="delivery_2">8–14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15-30" id="delivery_3" />
                          <Label htmlFor="delivery_3">15–30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-90" id="delivery_4" />
                          <Label htmlFor="delivery_4">30–90 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90+" id="delivery_5" />
                          <Label htmlFor="delivery_5">90+ days</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="chargeback-management">Chargeback Management System (if any)</Label>
                      <Input
                        id="chargeback-management"
                        {...form.register('chargebackManagement')}
                        placeholder="System name"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="deposits-required"
                          checked={form.getValues('depositsRequired')}
                          onCheckedChange={(checked) => form.setValue('depositsRequired', checked === true)}
                        />
                        <Label htmlFor="deposits-required">Deposits Required?</Label>
                      </div>
                      
                      {form.getValues('depositsRequired') && (
                        <div className="mt-2">
                          <Label htmlFor="deposit-percentage">% Required</Label>
                          <div className="relative">
                            <Input
                              id="deposit-percentage"
                              {...form.register('depositPercentage')}
                              placeholder="50"
                              className="pr-7"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>When is Full Payment Received?</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('fullPaymentTiming')}
                        onValueChange={(value) => form.setValue('fullPaymentTiming', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advance" id="payment_advance" />
                          <Label htmlFor="payment_advance">100% Paid in Advance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="delivery" id="payment_delivery" />
                          <Label htmlFor="payment_delivery">100% Paid on Delivery/Completion</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="sales-regions">Sales Regions</Label>
                      <Input
                        id="sales-regions"
                        {...form.register('salesRegions')}
                        placeholder="List regions"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="international-transactions">% of International Transactions</Label>
                      <div className="relative">
                        <Input
                          id="international-transactions"
                          {...form.register('internationalTransactionsPercentage')}
                          placeholder="10"
                          className="pr-7"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Shipping Method</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shipping-fedex"
                            checked={form.getValues('shippingMethod').includes('fedex')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('shippingMethod');
                              if (checked) {
                                form.setValue('shippingMethod', [...methods, 'fedex']);
                              } else {
                                form.setValue('shippingMethod', methods.filter(m => m !== 'fedex'));
                              }
                            }}
                          />
                          <Label htmlFor="shipping-fedex">FedEx</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shipping-ups"
                            checked={form.getValues('shippingMethod').includes('ups')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('shippingMethod');
                              if (checked) {
                                form.setValue('shippingMethod', [...methods, 'ups']);
                              } else {
                                form.setValue('shippingMethod', methods.filter(m => m !== 'ups'));
                              }
                            }}
                          />
                          <Label htmlFor="shipping-ups">UPS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shipping-usps"
                            checked={form.getValues('shippingMethod').includes('usps')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('shippingMethod');
                              if (checked) {
                                form.setValue('shippingMethod', [...methods, 'usps']);
                              } else {
                                form.setValue('shippingMethod', methods.filter(m => m !== 'usps'));
                              }
                            }}
                          />
                          <Label htmlFor="shipping-usps">USPS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shipping-other"
                            checked={form.getValues('shippingMethod').includes('other')}
                            onCheckedChange={(checked) => {
                              const methods = form.getValues('shippingMethod');
                              if (checked) {
                                form.setValue('shippingMethod', [...methods, 'other']);
                              } else {
                                form.setValue('shippingMethod', methods.filter(m => m !== 'other'));
                              }
                            }}
                          />
                          <Label htmlFor="shipping-other">Other</Label>
                        </div>
                      </div>
                    </div>
                    
                    {form.getValues('shippingMethod').includes('other') && (
                      <div>
                        <Label htmlFor="shipping-other-specify">Other Shipping Method</Label>
                        <Input
                          id="shipping-other-specify"
                          {...form.register('shippingMethodOther')}
                          placeholder="Please specify"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Advertising Channels</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ads-catalog"
                            checked={form.getValues('advertisingChannels').includes('catalog')}
                            onCheckedChange={(checked) => {
                              const channels = form.getValues('advertisingChannels');
                              if (checked) {
                                form.setValue('advertisingChannels', [...channels, 'catalog']);
                              } else {
                                form.setValue('advertisingChannels', channels.filter(c => c !== 'catalog'));
                              }
                            }}
                          />
                          <Label htmlFor="ads-catalog">Catalog</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ads-tv-radio"
                            checked={form.getValues('advertisingChannels').includes('tv_radio')}
                            onCheckedChange={(checked) => {
                              const channels = form.getValues('advertisingChannels');
                              if (checked) {
                                form.setValue('advertisingChannels', [...channels, 'tv_radio']);
                              } else {
                                form.setValue('advertisingChannels', channels.filter(c => c !== 'tv_radio'));
                              }
                            }}
                          />
                          <Label htmlFor="ads-tv-radio">TV/Radio</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ads-flyers"
                            checked={form.getValues('advertisingChannels').includes('flyers')}
                            onCheckedChange={(checked) => {
                              const channels = form.getValues('advertisingChannels');
                              if (checked) {
                                form.setValue('advertisingChannels', [...channels, 'flyers']);
                              } else {
                                form.setValue('advertisingChannels', channels.filter(c => c !== 'flyers'));
                              }
                            }}
                          />
                          <Label htmlFor="ads-flyers">Flyers/Direct Mail</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ads-internet"
                            checked={form.getValues('advertisingChannels').includes('internet')}
                            onCheckedChange={(checked) => {
                              const channels = form.getValues('advertisingChannels');
                              if (checked) {
                                form.setValue('advertisingChannels', [...channels, 'internet']);
                              } else {
                                form.setValue('advertisingChannels', channels.filter(c => c !== 'internet'));
                              }
                            }}
                          />
                          <Label htmlFor="ads-internet">Internet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ads-other"
                            checked={form.getValues('advertisingChannels').includes('other')}
                            onCheckedChange={(checked) => {
                              const channels = form.getValues('advertisingChannels');
                              if (checked) {
                                form.setValue('advertisingChannels', [...channels, 'other']);
                              } else {
                                form.setValue('advertisingChannels', channels.filter(c => c !== 'other'));
                              }
                            }}
                          />
                          <Label htmlFor="ads-other">Other</Label>
                        </div>
                      </div>
                    </div>
                    
                    {form.getValues('advertisingChannels').includes('other') && (
                      <div>
                        <Label htmlFor="ads-other-specify">Other Advertising Channels</Label>
                        <Input
                          id="ads-other-specify"
                          {...form.register('advertisingChannelsOther')}
                          placeholder="Please specify"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Warranty / Guarantee Provided By</Label>
                      <RadioGroup 
                        defaultValue={form.getValues('warrantyProvider')}
                        onValueChange={(value) => form.setValue('warrantyProvider', value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merchant" id="warranty_merchant" />
                          <Label htmlFor="warranty_merchant">Merchant</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manufacturer" id="warranty_manufacturer" />
                          <Label htmlFor="warranty_manufacturer">Manufacturer</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>Previous</Button>
                  </div>
                </TabsContent>
              </form>
            </ScrollArea>
          </Tabs>
          
          <div className="mt-6 flex justify-between">
            <div className="flex p-3 bg-blue-50 border border-blue-200 rounded-lg flex-1 mr-4">
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2 mt-0.5" />
              <p className="text-sm text-blue-800">
                This form will be used to generate a custom merchant application PDF. Fill out as many fields as possible for the most complete document.
              </p>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={generating || !selectedIndustryId}
              className="min-w-[140px]"
            >
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
