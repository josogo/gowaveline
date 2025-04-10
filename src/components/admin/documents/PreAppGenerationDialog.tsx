
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
import { Industry, Lead } from '../industries/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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
  const [activeTab, setActiveTab] = useState('industry');
  const [formData, setFormData] = useState<MerchantApplicationFormData>(initialFormData);

  // Fetch industries and leads when the dialog opens
  React.useEffect(() => {
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
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    setGenerating(true);

    try {
      console.log("Starting PDF generation process");
      
      // Verify user is authenticated
      const { data, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error("Authentication error:", authError);
        toast.error("Authentication error. Please log in and try again.");
        setGenerating(false);
        return;
      }

      // Call the edge function with all form data
      const { data: responseData, error } = await supabase.functions.invoke('generate-pre-app', {
        body: { 
          industryId: selectedIndustryId,
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
      link.download = `${industryName.replace(/\s+/g, '_')}_merchant_application.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      onSuccess();
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
            Create a merchant application form for your selected industry
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="industry" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-7">
            <TabsTrigger value="industry">1. Industry</TabsTrigger>
            <TabsTrigger value="business">2. Business</TabsTrigger>
            <TabsTrigger value="contact">3. Contact</TabsTrigger>
            <TabsTrigger value="processing">4. Processing</TabsTrigger>
            <TabsTrigger value="banking">5. Banking</TabsTrigger>
            <TabsTrigger value="operations">6. Operations</TabsTrigger>
            <TabsTrigger value="ecommerce">7. eCommerce</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto mt-4">
            <TabsContent value="industry" className="space-y-4 p-1">
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
                <p className="text-sm text-gray-500 mt-2">
                  Select the industry for this merchant application form.
                </p>
              </div>
              
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
                  The generated application will include comprehensive sections for business structure, information, processing volumes, and more.
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
                  
                  <div>
                    <Label className="text-sm">Own or Rent</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="own" checked={formData.ownRent === 'Own'} 
                          onCheckedChange={(checked) => handleInputChange('ownRent', checked ? 'Own' : '')} />
                        <label htmlFor="own" className="text-sm">Own</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="rent" checked={formData.ownRent === 'Rent'} 
                          onCheckedChange={(checked) => handleInputChange('ownRent', checked ? 'Rent' : '')} />
                        <label htmlFor="rent" className="text-sm">Rent</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Approx. Square Footage</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sqft-1" checked={formData.squareFootage === '0–500 ft²'} 
                          onCheckedChange={(checked) => handleInputChange('squareFootage', checked ? '0–500 ft²' : '')} />
                        <label htmlFor="sqft-1" className="text-sm">0–500 ft²</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sqft-2" checked={formData.squareFootage === '501–2,000 ft²'} 
                          onCheckedChange={(checked) => handleInputChange('squareFootage', checked ? '501–2,000 ft²' : '')} />
                        <label htmlFor="sqft-2" className="text-sm">501–2,000 ft²</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sqft-3" checked={formData.squareFootage === '2,001–5,000 ft²'} 
                          onCheckedChange={(checked) => handleInputChange('squareFootage', checked ? '2,001–5,000 ft²' : '')} />
                        <label htmlFor="sqft-3" className="text-sm">2,001–5,000 ft²</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sqft-4" checked={formData.squareFootage === '5,000+ ft²'} 
                          onCheckedChange={(checked) => handleInputChange('squareFootage', checked ? '5,000+ ft²' : '')} />
                        <label htmlFor="sqft-4" className="text-sm">5,000+ ft²</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 p-1">
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
                  
                  <div>
                    <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
                    <Input
                      id="dob"
                      className="mt-2"
                      placeholder="MM/DD/YYYY" 
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ssn" className="text-sm">SSN</Label>
                    <Input
                      id="ssn"
                      className="mt-2" 
                      value={formData.ssn}
                      onChange={(e) => handleInputChange('ssn', e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="drivers-license" className="text-sm">Driver's License #</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input
                        id="drivers-license"
                        placeholder="License Number" 
                        value={formData.driversLicense}
                        onChange={(e) => handleInputChange('driversLicense', e.target.value)}
                      />
                      <Input
                        id="license-exp"
                        placeholder="Exp Date (MM/DD/YYYY)" 
                        value={formData.licenseExpDate}
                        onChange={(e) => handleInputChange('licenseExpDate', e.target.value)}
                      />
                      <Input
                        id="license-state"
                        placeholder="State" 
                        value={formData.licenseState}
                        onChange={(e) => handleInputChange('licenseState', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="home-address" className="text-sm">Home Address</Label>
                    <Input
                      id="home-address"
                      className="mt-2" 
                      value={formData.homeAddress}
                      onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="personal-email" className="text-sm">Personal Email</Label>
                    <Input
                      id="personal-email"
                      className="mt-2" 
                      value={formData.personalEmail}
                      onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    />
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
            
            <TabsContent value="processing" className="space-y-4 p-1">
              <div>
                <Label>Processing Volume</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="total-volume" className="text-sm">Estimated Total Monthly Volume (All payment types)</Label>
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
                  
                  <div>
                    <Label htmlFor="amex-volume" className="text-sm">American Express Volume</Label>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">$</span>
                      <Input
                        id="amex-volume"
                        value={formData.amexVolume}
                        onChange={(e) => handleInputChange('amexVolume', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="avg-ticket" className="text-sm">Average Ticket</Label>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">$</span>
                      <Input
                        id="avg-ticket"
                        value={formData.averageTicket}
                        onChange={(e) => handleInputChange('averageTicket', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="high-ticket" className="text-sm">Highest Ticket</Label>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">$</span>
                      <Input
                        id="high-ticket"
                        value={formData.highestTicket}
                        onChange={(e) => handleInputChange('highestTicket', e.target.value)}
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
                  
                  <div>
                    <Label className="text-sm">Seasonal Business?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="seasonal-yes" checked={formData.isSeasonalBusiness === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('isSeasonalBusiness', checked ? 'Yes' : '')} />
                        <label htmlFor="seasonal-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="seasonal-no" checked={formData.isSeasonalBusiness === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('isSeasonalBusiness', checked ? 'No' : '')} />
                        <label htmlFor="seasonal-no" className="text-sm">No</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Recurring Payments/Subscriptions?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="recurring-yes" checked={formData.hasRecurringPayments === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('hasRecurringPayments', checked ? 'Yes' : '')} />
                        <label htmlFor="recurring-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="recurring-no" checked={formData.hasRecurringPayments === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('hasRecurringPayments', checked ? 'No' : '')} />
                        <label htmlFor="recurring-no" className="text-sm">No</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {formData.hasRecurringPayments === 'Yes' && (
                  <div className="mt-2">
                    <Label htmlFor="recurring-details" className="text-sm">Specify recurring payment details</Label>
                    <Input
                      id="recurring-details"
                      className="mt-2" 
                      value={formData.recurringPaymentsDetails}
                      onChange={(e) => handleInputChange('recurringPaymentsDetails', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="banking" className="space-y-4 p-1">
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
                  
                  <div>
                    <Label htmlFor="storage-location" className="text-sm">Storage Location (if applicable)</Label>
                    <Input
                      id="storage-location"
                      className="mt-2" 
                      value={formData.storageLocation}
                      onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Refund / Cancellation Policy</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Do you have a refund policy?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="refund-yes" checked={formData.hasRefundPolicy === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('hasRefundPolicy', checked ? 'Yes' : '')} />
                        <label htmlFor="refund-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="refund-no" checked={formData.hasRefundPolicy === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('hasRefundPolicy', checked ? 'No' : '')} />
                        <label htmlFor="refund-no" className="text-sm">No</label>
                      </div>
                    </div>
                  </div>
                  
                  {formData.hasRefundPolicy === 'Yes' && (
                    <div>
                      <Label className="text-sm">Policy Type</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="exchange" checked={formData.policyType === 'Exchange'} 
                            onCheckedChange={(checked) => handleInputChange('policyType', checked ? 'Exchange' : '')} />
                          <label htmlFor="exchange" className="text-sm">Exchange</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="store-credit" checked={formData.policyType === 'Store Credit'} 
                            onCheckedChange={(checked) => handleInputChange('policyType', checked ? 'Store Credit' : '')} />
                          <label htmlFor="store-credit" className="text-sm">Store Credit</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="refund-30" checked={formData.policyType === 'Refund within 30 days'} 
                            onCheckedChange={(checked) => handleInputChange('policyType', checked ? 'Refund within 30 days' : '')} />
                          <label htmlFor="refund-30" className="text-sm">Refund within 30 days</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="policy-other" checked={formData.policyType === 'Other'} 
                            onCheckedChange={(checked) => handleInputChange('policyType', checked ? 'Other' : '')} />
                          <label htmlFor="policy-other" className="text-sm">Other</label>
                        </div>
                      </div>
                      
                      {formData.policyType === 'Other' && (
                        <Input
                          className="mt-2"
                          placeholder="Please specify"
                          value={formData.policyTypeOther}
                          onChange={(e) => handleInputChange('policyTypeOther', e.target.value)}
                        />
                      )}
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm">Processing History?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="history-yes" checked={formData.processingHistory === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('processingHistory', checked ? 'Yes' : '')} />
                        <label htmlFor="history-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="history-no" checked={formData.processingHistory === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('processingHistory', checked ? 'No' : '')} />
                        <label htmlFor="history-no" className="text-sm">No</label>
                      </div>
                    </div>
                    {formData.processingHistory === 'Yes' && (
                      <p className="text-xs text-gray-500 mt-1">If yes, attach 3 most recent processing statements.</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="prev-processors" className="text-sm">Current/Previous Processor(s)</Label>
                    <Input
                      id="prev-processors"
                      className="mt-2" 
                      value={formData.previousProcessors}
                      onChange={(e) => handleInputChange('previousProcessors', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Previous Terminations?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="term-yes" checked={formData.previousTerminations === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('previousTerminations', checked ? 'Yes' : '')} />
                        <label htmlFor="term-yes" className="text-sm">Yes*</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="term-no" checked={formData.previousTerminations === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('previousTerminations', checked ? 'No' : '')} />
                        <label htmlFor="term-no" className="text-sm">No</label>
                      </div>
                    </div>
                    
                    {formData.previousTerminations === 'Yes' && (
                      <Input
                        className="mt-2"
                        placeholder="If Yes, explain"
                        value={formData.terminationsExplanation}
                        onChange={(e) => handleInputChange('terminationsExplanation', e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm">Bankruptcies?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bankrupt-yes" checked={formData.bankruptcies === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('bankruptcies', checked ? 'Yes' : '')} />
                        <label htmlFor="bankrupt-yes" className="text-sm">Yes*</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bankrupt-no" checked={formData.bankruptcies === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('bankruptcies', checked ? 'No' : '')} />
                        <label htmlFor="bankrupt-no" className="text-sm">No</label>
                      </div>
                    </div>
                    
                    {formData.bankruptcies === 'Yes' && (
                      <Input
                        className="mt-2"
                        placeholder="If Yes, explain"
                        value={formData.bankruptciesExplanation}
                        onChange={(e) => handleInputChange('bankruptciesExplanation', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="operations" className="space-y-4 p-1">
              <div>
                <Label>Inventory & Operations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                  
                  <div>
                    <Label htmlFor="fulfillment" className="text-sm">Fulfillment Provider(s)</Label>
                    <Input
                      id="fulfillment"
                      className="mt-2" 
                      value={formData.fulfillmentProviders}
                      onChange={(e) => handleInputChange('fulfillmentProviders', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shopping-platforms" className="text-sm">Shopping Cart / CRM Platform(s)</Label>
                    <Input
                      id="shopping-platforms"
                      className="mt-2" 
                      value={formData.shoppingCartPlatforms}
                      onChange={(e) => handleInputChange('shoppingCartPlatforms', e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label className="text-sm">How Do Customers Purchase?</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="purchase-in-person" 
                          checked={formData.purchaseMethods?.includes('In Person') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('purchaseMethods', 'In Person', checked as boolean)} />
                        <label htmlFor="purchase-in-person" className="text-sm">In Person</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="purchase-mail-phone" 
                          checked={formData.purchaseMethods?.includes('Mail/Phone') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('purchaseMethods', 'Mail/Phone', checked as boolean)} />
                        <label htmlFor="purchase-mail-phone" className="text-sm">Mail/Phone</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="purchase-internet" 
                          checked={formData.purchaseMethods?.includes('Internet') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('purchaseMethods', 'Internet', checked as boolean)} />
                        <label htmlFor="purchase-internet" className="text-sm">Internet</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="purchase-fax" 
                          checked={formData.purchaseMethods?.includes('Fax') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('purchaseMethods', 'Fax', checked as boolean)} />
                        <label htmlFor="purchase-fax" className="text-sm">Fax</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="purchase-other" 
                          checked={formData.purchaseMethods?.includes('Other') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('purchaseMethods', 'Other', checked as boolean)} />
                        <label htmlFor="purchase-other" className="text-sm">Other</label>
                      </div>
                    </div>
                    
                    {formData.purchaseMethods?.includes('Other') && (
                      <Input
                        className="mt-2"
                        placeholder="Please specify"
                        value={formData.purchaseMethodOther}
                        onChange={(e) => handleInputChange('purchaseMethodOther', e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="call-center" className="text-sm">Call Center Provider(s)</Label>
                    <Input
                      id="call-center"
                      className="mt-2" 
                      value={formData.callCenterProviders}
                      onChange={(e) => handleInputChange('callCenterProviders', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ecommerce" className="space-y-4 p-1">
              <div>
                <Label>eCommerce / Card-Not-Present Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Authorization to Shipment Timeframe</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auth-ship-1" checked={formData.authToShipTimeframe === '0–7 days'} 
                          onCheckedChange={(checked) => handleInputChange('authToShipTimeframe', checked ? '0–7 days' : '')} />
                        <label htmlFor="auth-ship-1" className="text-sm">0–7 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auth-ship-2" checked={formData.authToShipTimeframe === '8–14 days'} 
                          onCheckedChange={(checked) => handleInputChange('authToShipTimeframe', checked ? '8–14 days' : '')} />
                        <label htmlFor="auth-ship-2" className="text-sm">8–14 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auth-ship-3" checked={formData.authToShipTimeframe === '15–30 days'} 
                          onCheckedChange={(checked) => handleInputChange('authToShipTimeframe', checked ? '15–30 days' : '')} />
                        <label htmlFor="auth-ship-3" className="text-sm">15–30 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auth-ship-4" checked={formData.authToShipTimeframe === '30–90 days'} 
                          onCheckedChange={(checked) => handleInputChange('authToShipTimeframe', checked ? '30–90 days' : '')} />
                        <label htmlFor="auth-ship-4" className="text-sm">30–90 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auth-ship-5" checked={formData.authToShipTimeframe === '90+ days'} 
                          onCheckedChange={(checked) => handleInputChange('authToShipTimeframe', checked ? '90+ days' : '')} />
                        <label htmlFor="auth-ship-5" className="text-sm">90+ days</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Delivery Timeframe to Customer</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-1" checked={formData.deliveryTimeframe === '0–7 days'} 
                          onCheckedChange={(checked) => handleInputChange('deliveryTimeframe', checked ? '0–7 days' : '')} />
                        <label htmlFor="delivery-1" className="text-sm">0–7 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-2" checked={formData.deliveryTimeframe === '8–14 days'} 
                          onCheckedChange={(checked) => handleInputChange('deliveryTimeframe', checked ? '8–14 days' : '')} />
                        <label htmlFor="delivery-2" className="text-sm">8–14 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-3" checked={formData.deliveryTimeframe === '15–30 days'} 
                          onCheckedChange={(checked) => handleInputChange('deliveryTimeframe', checked ? '15–30 days' : '')} />
                        <label htmlFor="delivery-3" className="text-sm">15–30 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-4" checked={formData.deliveryTimeframe === '30–90 days'} 
                          onCheckedChange={(checked) => handleInputChange('deliveryTimeframe', checked ? '30–90 days' : '')} />
                        <label htmlFor="delivery-4" className="text-sm">30–90 days</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-5" checked={formData.deliveryTimeframe === '90+ days'} 
                          onCheckedChange={(checked) => handleInputChange('deliveryTimeframe', checked ? '90+ days' : '')} />
                        <label htmlFor="delivery-5" className="text-sm">90+ days</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="chargeback-system" className="text-sm">Chargeback Management System (if any)</Label>
                    <Input
                      id="chargeback-system"
                      className="mt-2" 
                      value={formData.chargebackSystem}
                      onChange={(e) => handleInputChange('chargebackSystem', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Deposits Required?</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="deposits-yes" checked={formData.depositsRequired === 'Yes'} 
                          onCheckedChange={(checked) => handleInputChange('depositsRequired', checked ? 'Yes' : '')} />
                        <label htmlFor="deposits-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="deposits-no" checked={formData.depositsRequired === 'No'} 
                          onCheckedChange={(checked) => handleInputChange('depositsRequired', checked ? 'No' : '')} />
                        <label htmlFor="deposits-no" className="text-sm">No</label>
                      </div>
                    </div>
                    
                    {formData.depositsRequired === 'Yes' && (
                      <div className="flex items-center mt-2">
                        <Input
                          placeholder="% Required"
                          value={formData.depositPercentage}
                          onChange={(e) => handleInputChange('depositPercentage', e.target.value)}
                        />
                        <span className="ml-2">%</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm">When is Full Payment Received?</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-advance" checked={formData.fullPaymentReceived === '100% Paid in Advance'} 
                          onCheckedChange={(checked) => handleInputChange('fullPaymentReceived', checked ? '100% Paid in Advance' : '')} />
                        <label htmlFor="payment-advance" className="text-sm">100% Paid in Advance</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="payment-delivery" checked={formData.fullPaymentReceived === '100% Paid on Delivery/Completion'} 
                          onCheckedChange={(checked) => handleInputChange('fullPaymentReceived', checked ? '100% Paid on Delivery/Completion' : '')} />
                        <label htmlFor="payment-delivery" className="text-sm">100% Paid on Delivery/Completion</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="sales-regions" className="text-sm">Sales Regions</Label>
                    <Input
                      id="sales-regions"
                      className="mt-2" 
                      value={formData.salesRegions}
                      onChange={(e) => handleInputChange('salesRegions', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="intl-transactions" className="text-sm">% of International Transactions</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="intl-transactions"
                        value={formData.internationalTransactionPercent}
                        onChange={(e) => handleInputChange('internationalTransactionPercent', e.target.value)}
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label className="text-sm">Shipping Method</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shipping-fedex" 
                          checked={formData.shippingMethod?.includes('FedEx') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('shippingMethod', 'FedEx', checked as boolean)} />
                        <label htmlFor="shipping-fedex" className="text-sm">FedEx</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shipping-ups" 
                          checked={formData.shippingMethod?.includes('UPS') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('shippingMethod', 'UPS', checked as boolean)} />
                        <label htmlFor="shipping-ups" className="text-sm">UPS</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shipping-usps" 
                          checked={formData.shippingMethod?.includes('USPS') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('shippingMethod', 'USPS', checked as boolean)} />
                        <label htmlFor="shipping-usps" className="text-sm">USPS</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shipping-other" 
                          checked={formData.shippingMethod?.includes('Other') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('shippingMethod', 'Other', checked as boolean)} />
                        <label htmlFor="shipping-other" className="text-sm">Other</label>
                      </div>
                    </div>
                    
                    {formData.shippingMethod?.includes('Other') && (
                      <Input
                        className="mt-2"
                        placeholder="Please specify"
                        value={formData.shippingMethodOther}
                        onChange={(e) => handleInputChange('shippingMethodOther', e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label className="text-sm">Advertising Channels</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ad-catalog" 
                          checked={formData.advertisingChannels?.includes('Catalog') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('advertisingChannels', 'Catalog', checked as boolean)} />
                        <label htmlFor="ad-catalog" className="text-sm">Catalog</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ad-tv-radio" 
                          checked={formData.advertisingChannels?.includes('TV/Radio') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('advertisingChannels', 'TV/Radio', checked as boolean)} />
                        <label htmlFor="ad-tv-radio" className="text-sm">TV/Radio</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ad-direct-mail" 
                          checked={formData.advertisingChannels?.includes('Flyers/Direct Mail') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('advertisingChannels', 'Flyers/Direct Mail', checked as boolean)} />
                        <label htmlFor="ad-direct-mail" className="text-sm">Flyers/Direct Mail</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ad-internet" 
                          checked={formData.advertisingChannels?.includes('Internet') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('advertisingChannels', 'Internet', checked as boolean)} />
                        <label htmlFor="ad-internet" className="text-sm">Internet</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ad-other" 
                          checked={formData.advertisingChannels?.includes('Other') || false}
                          onCheckedChange={(checked) => handleArrayInputChange('advertisingChannels', 'Other', checked as boolean)} />
                        <label htmlFor="ad-other" className="text-sm">Other</label>
                      </div>
                    </div>
                    
                    {formData.advertisingChannels?.includes('Other') && (
                      <Input
                        className="mt-2"
                        placeholder="Please specify"
                        value={formData.advertisingChannelsOther}
                        onChange={(e) => handleInputChange('advertisingChannelsOther', e.target.value)}
                      />
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm">Warranty / Guarantee Provided By</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="warranty-merchant" checked={formData.warrantyProvider === 'Merchant'} 
                          onCheckedChange={(checked) => handleInputChange('warrantyProvider', checked ? 'Merchant' : '')} />
                        <label htmlFor="warranty-merchant" className="text-sm">Merchant</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="warranty-manufacturer" checked={formData.warrantyProvider === 'Manufacturer'} 
                          onCheckedChange={(checked) => handleInputChange('warrantyProvider', checked ? 'Manufacturer' : '')} />
                        <label htmlFor="warranty-manufacturer" className="text-sm">Manufacturer</label>
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
            disabled={generating || !selectedIndustryId}
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Merchant Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
