
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { createDocument } from './api';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [processing, setProcessing] = useState(false);
  
  // Business Structure
  const [businessStructure, setBusinessStructure] = useState<string>('');
  const [otherBusinessStructure, setOtherBusinessStructure] = useState<string>('');
  
  // Business Information
  const [businessName, setBusinessName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessFax, setBusinessFax] = useState('');
  const [customerServicePhone, setCustomerServicePhone] = useState('');
  const [customerServiceEmail, setCustomerServiceEmail] = useState('');
  const [website, setWebsite] = useState('');
  
  // Authorized Contact
  const [contactName, setContactName] = useState('');
  
  // Equipment / Software
  const [terminalGateway, setTerminalGateway] = useState('');
  const [shoppingCart, setShoppingCart] = useState('');
  
  // Business Location
  const [employeeCount, setEmployeeCount] = useState('');
  const [locationType, setLocationType] = useState<string>('');
  const [ownOrRent, setOwnOrRent] = useState<string>('');
  const [squareFootage, setSquareFootage] = useState<string>('');
  
  // Principal Information
  const [principalName, setPrincipalName] = useState('');
  const [ownershipPercentage, setOwnershipPercentage] = useState('');
  const [hasAdditionalOwners, setHasAdditionalOwners] = useState(false);
  const [title, setTitle] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ssn, setSsn] = useState('');
  const [driversLicense, setDriversLicense] = useState('');
  const [licenseExpDate, setLicenseExpDate] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  
  // Bank Settlement Information
  const [bankName, setBankName] = useState('');
  const [bankContact, setBankContact] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  // Business Description
  const [productsServices, setProductsServices] = useState('');
  const [yearsInOperation, setYearsInOperation] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  
  // Processing Volume
  const [monthlyVolume, setMonthlyVolume] = useState('');
  const [visaMastercardVolume, setVisaMastercardVolume] = useState('');
  const [amexVolume, setAmexVolume] = useState('');
  const [averageTicket, setAverageTicket] = useState('');
  const [highestTicket, setHighestTicket] = useState('');
  
  // Transaction Method
  const [faceToFacePercent, setFaceToFacePercent] = useState('');
  const [motoPercent, setMotoPercent] = useState('');
  const [ecommercePercent, setEcommercePercent] = useState('');
  
  // Refund / Cancellation
  const [hasRefundPolicy, setHasRefundPolicy] = useState<string>('');
  const [refundPolicyType, setRefundPolicyType] = useState<string>('');
  const [otherRefundPolicy, setOtherRefundPolicy] = useState('');
  const [hasProcessingHistory, setHasProcessingHistory] = useState<string>('');
  const [previousProcessor, setPreviousProcessor] = useState('');
  const [hasPreviousTerminations, setHasPreviousTerminations] = useState<string>('');
  const [terminationsExplanation, setTerminationsExplanation] = useState('');
  const [hasBankruptcies, setHasBankruptcies] = useState<string>('');
  const [bankruptciesExplanation, setBankruptciesExplanation] = useState('');
  
  // Business Type
  const [b2bPercent, setB2bPercent] = useState('');
  const [b2cPercent, setB2cPercent] = useState('');
  const [isSeasonalBusiness, setIsSeasonalBusiness] = useState<string>('');
  const [hasRecurringPayments, setHasRecurringPayments] = useState<string>('');
  const [recurringPaymentsDetails, setRecurringPaymentsDetails] = useState('');
  
  // eCommerce / Card-Not-Present
  const [productPurchaseAddresses, setProductPurchaseAddresses] = useState('');
  const [inventoryOwner, setInventoryOwner] = useState<string>('');
  const [fulfillmentProviders, setFulfillmentProviders] = useState('');
  const [shoppingCartPlatforms, setShoppingCartPlatforms] = useState('');
  const [purchaseMethods, setPurchaseMethods] = useState<string[]>([]);
  const [otherPurchaseMethod, setOtherPurchaseMethod] = useState('');
  const [callCenterProviders, setCallCenterProviders] = useState('');
  const [authToShipTimeframe, setAuthToShipTimeframe] = useState<string>('');
  const [deliveryTimeframe, setDeliveryTimeframe] = useState<string>('');
  const [chargebackSystem, setChargebackSystem] = useState('');
  const [requiresDeposits, setRequiresDeposits] = useState<string>('');
  const [depositPercent, setDepositPercent] = useState('');
  const [paymentTiming, setPaymentTiming] = useState<string>('');
  const [salesRegions, setSalesRegions] = useState('');
  const [internationalPercent, setInternationalPercent] = useState('');
  const [shippingMethods, setShippingMethods] = useState<string[]>([]);
  const [otherShippingMethod, setOtherShippingMethod] = useState('');
  const [advertisingChannels, setAdvertisingChannels] = useState<string[]>([]);
  const [otherAdvertisingChannel, setOtherAdvertisingChannel] = useState('');
  const [warrantyProvider, setWarrantyProvider] = useState<string>('');
  
  // Form validation
  const [activeTab, setActiveTab] = useState('business-info');
  
  const isValidForm = () => {
    // Minimum required fields validation
    if (!businessName) {
      toast.error("Business name is required");
      return false;
    }
    
    if (!businessEmail) {
      toast.error("Business email is required");
      return false;
    }
    
    if (!businessPhone) {
      toast.error("Business phone is required");
      return false;
    }
    
    return true;
  };
  
  const handleGenerate = async () => {
    if (!isValidForm()) return;
    
    setProcessing(true);
    
    try {
      // Prepare form data for the PDF generation
      const formData = {
        // Business Structure
        businessStructure,
        otherBusinessStructure: businessStructure === 'Other' ? otherBusinessStructure : '',
        
        // Business Information
        businessName,
        streetAddress,
        mailingAddress,
        businessPhone,
        businessEmail,
        businessFax,
        customerServicePhone,
        customerServiceEmail,
        website,
        
        // Authorized Contact
        contactName,
        
        // Equipment / Software
        terminalGateway,
        shoppingCart,
        
        // Business Location
        employeeCount,
        locationType,
        ownOrRent,
        squareFootage,
        
        // Principal Information
        principalName,
        ownershipPercentage,
        hasAdditionalOwners,
        title,
        homePhone,
        dateOfBirth,
        ssn,
        driversLicense,
        licenseExpDate,
        licenseState,
        homeAddress,
        personalEmail,
        
        // Bank Settlement Information
        bankName,
        bankContact,
        routingNumber,
        accountNumber,
        
        // Business Description
        productsServices,
        yearsInOperation,
        storageLocation,
        
        // Processing Volume
        monthlyVolume,
        visaMastercardVolume,
        amexVolume,
        averageTicket,
        highestTicket,
        
        // Transaction Method
        faceToFacePercent,
        motoPercent,
        ecommercePercent,
        
        // Refund / Cancellation
        hasRefundPolicy,
        refundPolicyType,
        otherRefundPolicy: refundPolicyType === 'Other' ? otherRefundPolicy : '',
        hasProcessingHistory,
        previousProcessor,
        hasPreviousTerminations,
        terminationsExplanation: hasPreviousTerminations === 'Yes' ? terminationsExplanation : '',
        hasBankruptcies,
        bankruptciesExplanation: hasBankruptcies === 'Yes' ? bankruptciesExplanation : '',
        
        // Business Type
        b2bPercent,
        b2cPercent,
        isSeasonalBusiness,
        hasRecurringPayments,
        recurringPaymentsDetails: hasRecurringPayments === 'Yes' ? recurringPaymentsDetails : '',
        
        // eCommerce / Card-Not-Present
        productPurchaseAddresses,
        inventoryOwner,
        fulfillmentProviders,
        shoppingCartPlatforms,
        purchaseMethods,
        otherPurchaseMethod: purchaseMethods.includes('Other') ? otherPurchaseMethod : '',
        callCenterProviders,
        authToShipTimeframe,
        deliveryTimeframe,
        chargebackSystem,
        requiresDeposits,
        depositPercent: requiresDeposits === 'Yes' ? depositPercent : '',
        paymentTiming,
        salesRegions,
        internationalPercent,
        shippingMethods,
        otherShippingMethod: shippingMethods.includes('Other') ? otherShippingMethod : '',
        advertisingChannels,
        otherAdvertisingChannel: advertisingChannels.includes('Other') ? otherAdvertisingChannel : '',
        warrantyProvider,
        
        // Date fields
        date: new Date().toLocaleDateString()
      };
      
      // Call edge function to generate pre-app PDF
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        throw new Error('User not authenticated');
      }
      
      // Call the edge function
      const response = await supabase.functions.invoke('generate-pre-app', {
        body: { formData }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate PDF');
      }
      
      if (!response.data || !response.data.pdfBase64) {
        throw new Error('Failed to generate PDF');
      }
      
      // Convert the data to a Blob
      const base64Data = response.data.pdfBase64;
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      
      // Create a Blob from the binary data
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      // Upload to storage
      const fileName = `PreApp_${businessName}_${new Date().getTime()}.pdf`;
      const filePath = `${session.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Create document record
      await createDocument({
        name: `Pre-App for ${businessName}`,
        description: `Pre-application form for ${businessName}`,
        file_path: filePath,
        file_type: 'application/pdf',
        file_size: blob.size,
        uploaded_by: session.user.id,
        document_type: 'preapp',
        is_template: false,
        metadata: formData
      });
      
      toast.success('Pre-application document generated successfully');
      onSuccess();
      onOpenChange(false);
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error generating pre-app document:', error);
      toast.error(`Failed to generate document: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !processing && onOpenChange(open)}>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Generate Pre-Application Document</DialogTitle>
          <DialogDescription>
            Fill out the business information to generate a comprehensive pre-application form.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="business-info">Business Info</TabsTrigger>
            <TabsTrigger value="principal-info">Principal Info</TabsTrigger>
            <TabsTrigger value="bank-info">Bank Info</TabsTrigger>
            <TabsTrigger value="processing-info">Processing</TabsTrigger>
            <TabsTrigger value="refund-policy">Refund Policy</TabsTrigger>
            <TabsTrigger value="ecommerce">eCommerce</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[60vh]">
            <div className="p-4">
              <TabsContent value="business-info">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">1. Business Structure</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroup value={businessStructure} onValueChange={setBusinessStructure}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Sole Proprietorship" id="sole-prop" />
                            <Label htmlFor="sole-prop">Sole Proprietorship</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Corporation" id="corp" />
                            <Label htmlFor="corp">Corporation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="LLC" id="llc" />
                            <Label htmlFor="llc">LLC</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Non-profit" id="non-profit" />
                            <Label htmlFor="non-profit">Non-profit (401(c))</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Government" id="gov" />
                            <Label htmlFor="gov">Government</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Other" id="other-structure" />
                            <Label htmlFor="other-structure">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {businessStructure === 'Other' && (
                        <div>
                          <Input 
                            value={otherBusinessStructure} 
                            onChange={(e) => setOtherBusinessStructure(e.target.value)}
                            placeholder="Specify other business structure"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">2. Business Information</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Enter business name"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="streetAddress">Street (Location) Address</Label>
                        <Input
                          id="streetAddress"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="Enter street address"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="mailingAddress">Mailing (Legal) Address</Label>
                        <Input
                          id="mailingAddress"
                          value={mailingAddress}
                          onChange={(e) => setMailingAddress(e.target.value)}
                          placeholder="Enter mailing address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="businessPhone">Business/Contact Telephone <span className="text-red-500">*</span></Label>
                          <Input
                            id="businessPhone"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                            placeholder="Enter business phone"
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="businessEmail">Business/Contact Email <span className="text-red-500">*</span></Label>
                          <Input
                            id="businessEmail"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder="Enter business email"
                            type="email"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="businessFax">Business Fax #</Label>
                          <Input
                            id="businessFax"
                            value={businessFax}
                            onChange={(e) => setBusinessFax(e.target.value)}
                            placeholder="Enter business fax"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="customerServicePhone">Customer Service Telephone</Label>
                          <Input
                            id="customerServicePhone"
                            value={customerServicePhone}
                            onChange={(e) => setCustomerServicePhone(e.target.value)}
                            placeholder="Enter customer service phone"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="customerServiceEmail">Customer Service Email</Label>
                          <Input
                            id="customerServiceEmail"
                            value={customerServiceEmail}
                            onChange={(e) => setCustomerServiceEmail(e.target.value)}
                            placeholder="Enter customer service email"
                            type="email"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website/URL</Label>
                          <div className="flex items-center">
                            <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md text-gray-500">http://</span>
                            <Input
                              id="website"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              placeholder="yourbusiness.com"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">3. Authorized Contact</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="contactName">Full Name</Label>
                      <Input
                        id="contactName"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">4. Equipment / Software</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="terminalGateway">Terminal/Gateway Used</Label>
                        <Input
                          id="terminalGateway"
                          value={terminalGateway}
                          onChange={(e) => setTerminalGateway(e.target.value)}
                          placeholder="e.g., VX 520, Authorize.net, NMI"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="shoppingCart">Shopping Cart (if applicable)</Label>
                        <Input
                          id="shoppingCart"
                          value={shoppingCart}
                          onChange={(e) => setShoppingCart(e.target.value)}
                          placeholder="e.g., Shopify, WooCommerce"
                        />
                        <p className="text-xs text-gray-500">If using Shopify, request Authorize.net Gateway.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">5. Business Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="employeeCount">Number of Employees</Label>
                        <Input
                          id="employeeCount"
                          value={employeeCount}
                          onChange={(e) => setEmployeeCount(e.target.value)}
                          placeholder="Enter number of employees"
                          type="number"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Location Type</Label>
                      <RadioGroup value={locationType} onValueChange={setLocationType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Home/Residential" id="home" />
                          <Label htmlFor="home">Home/Residential</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Office/Business District" id="office" />
                          <Label htmlFor="office">Office/Business District</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Storefront" id="storefront" />
                          <Label htmlFor="storefront">Storefront</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Own or Rent</Label>
                      <RadioGroup value={ownOrRent} onValueChange={setOwnOrRent}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Own" id="own" />
                          <Label htmlFor="own">Own</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Rent" id="rent" />
                          <Label htmlFor="rent">Rent</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Approx. Square Footage</Label>
                      <RadioGroup value={squareFootage} onValueChange={setSquareFootage}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-500" id="ft-0-500" />
                          <Label htmlFor="ft-0-500">0–500 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="501-2000" id="ft-501-2000" />
                          <Label htmlFor="ft-501-2000">501–2,000 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2001-5000" id="ft-2001-5000" />
                          <Label htmlFor="ft-2001-5000">2,001–5,000 ft²</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5000+" id="ft-5000+" />
                          <Label htmlFor="ft-5000+">5,000+ ft²</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="principal-info">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">6. Principal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="principalName">Full Name</Label>
                      <Input
                        id="principalName"
                        value={principalName}
                        onChange={(e) => setPrincipalName(e.target.value)}
                        placeholder="Enter principal's full name"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="ownershipPercentage">Ownership %</Label>
                      <div className="flex items-center">
                        <Input
                          id="ownershipPercentage"
                          value={ownershipPercentage}
                          onChange={(e) => setOwnershipPercentage(e.target.value)}
                          placeholder="Enter ownership percentage"
                          type="number"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="additionalOwners"
                      checked={hasAdditionalOwners}
                      onCheckedChange={(checked) => setHasAdditionalOwners(checked === true)}
                    />
                    <Label htmlFor="additionalOwners">Check here if additional owners/members have 25%+ equity</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title (Owner, CEO, etc.)</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="homePhone">Home Telephone</Label>
                      <Input
                        id="homePhone"
                        value={homePhone}
                        onChange={(e) => setHomePhone(e.target.value)}
                        placeholder="Enter home phone"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="ssn">SSN</Label>
                      <Input
                        id="ssn"
                        value={ssn}
                        onChange={(e) => setSsn(e.target.value)}
                        placeholder="Enter SSN"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="driversLicense">Driver's License #</Label>
                      <Input
                        id="driversLicense"
                        value={driversLicense}
                        onChange={(e) => setDriversLicense(e.target.value)}
                        placeholder="Enter driver's license number"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="licenseExpDate">Exp Date</Label>
                      <Input
                        id="licenseExpDate"
                        value={licenseExpDate}
                        onChange={(e) => setLicenseExpDate(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="licenseState">State</Label>
                      <Input
                        id="licenseState"
                        value={licenseState}
                        onChange={(e) => setLicenseState(e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="homeAddress">Home Address</Label>
                    <Input
                      id="homeAddress"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      placeholder="Enter home address"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="personalEmail">Personal Email</Label>
                    <Input
                      id="personalEmail"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="Enter personal email"
                      type="email"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bank-info">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">7. Bank Settlement Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bankContact">Contact Name at Bank</Label>
                      <Input
                        id="bankContact"
                        value={bankContact}
                        onChange={(e) => setBankContact(e.target.value)}
                        placeholder="Enter bank contact name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        placeholder="Enter routing number"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter account number"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4 mt-8">8. Business Description</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="productsServices">Products/Services Sold</Label>
                      <Input
                        id="productsServices"
                        value={productsServices}
                        onChange={(e) => setProductsServices(e.target.value)}
                        placeholder="Enter products/services"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="yearsInOperation">Years in Operation</Label>
                        <Input
                          id="yearsInOperation"
                          value={yearsInOperation}
                          onChange={(e) => setYearsInOperation(e.target.value)}
                          placeholder="Enter years in operation"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="storageLocation">Storage Location (if applicable)</Label>
                        <Input
                          id="storageLocation"
                          value={storageLocation}
                          onChange={(e) => setStorageLocation(e.target.value)}
                          placeholder="Enter storage location"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="processing-info">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">9. Processing Volume</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="monthlyVolume">Estimated Total Monthly Volume</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">$</span>
                        <Input
                          id="monthlyVolume"
                          value={monthlyVolume}
                          onChange={(e) => setMonthlyVolume(e.target.value)}
                          placeholder="Enter amount"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="visaMastercardVolume">Visa/Mastercard Volume</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">$</span>
                        <Input
                          id="visaMastercardVolume"
                          value={visaMastercardVolume}
                          onChange={(e) => setVisaMastercardVolume(e.target.value)}
                          placeholder="Enter amount"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amexVolume">American Express Volume</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">$</span>
                        <Input
                          id="amexVolume"
                          value={amexVolume}
                          onChange={(e) => setAmexVolume(e.target.value)}
                          placeholder="Enter amount"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="averageTicket">Average Ticket</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">$</span>
                        <Input
                          id="averageTicket"
                          value={averageTicket}
                          onChange={(e) => setAverageTicket(e.target.value)}
                          placeholder="Enter amount"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="highestTicket">Highest Ticket</Label>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">$</span>
                        <Input
                          id="highestTicket"
                          value={highestTicket}
                          onChange={(e) => setHighestTicket(e.target.value)}
                          placeholder="Enter amount"
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4 mt-8">10. Transaction Method (Must Equal 100%)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="faceToFacePercent">Face-to-Face (Retail)</Label>
                      <div className="flex items-center">
                        <Input
                          id="faceToFacePercent"
                          value={faceToFacePercent}
                          onChange={(e) => setFaceToFacePercent(e.target.value)}
                          placeholder="Enter percentage"
                          type="number"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="motoPercent">Telephone/Mail/Email (MOTO)</Label>
                      <div className="flex items-center">
                        <Input
                          id="motoPercent"
                          value={motoPercent}
                          onChange={(e) => setMotoPercent(e.target.value)}
                          placeholder="Enter percentage"
                          type="number"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="ecommercePercent">Internet (eCommerce)</Label>
                      <div className="flex items-center">
                        <Input
                          id="ecommercePercent"
                          value={ecommercePercent}
                          onChange={(e) => setEcommercePercent(e.target.value)}
                          placeholder="Enter percentage"
                          type="number"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Note:</strong> The total percentage across all transaction methods should equal 100%
                    </p>
                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                      <p className="text-sm">
                        Total: {parseInt(faceToFacePercent || '0') + parseInt(motoPercent || '0') + parseInt(ecommercePercent || '0')}%
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4 mt-8">12. Business Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="b2bPercent">B2B (%)</Label>
                      <div className="flex items-center">
                        <Input
                          id="b2bPercent"
                          value={b2bPercent}
                          onChange={(e) => setB2bPercent(e.target.value)}
                          placeholder="Enter percentage"
                          type="number"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="b2cPercent">B2C (%)</Label>
                      <div className="flex items-center">
                        <Input
                          id="b2cPercent"
                          value={b2cPercent}
                          onChange={(e) => setB2cPercent(e.target.value)}
                          placeholder="Enter percentage"
                          type="number"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Note:</strong> The total percentage across B2B and B2C should equal 100%
                    </p>
                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                      <p className="text-sm">
                        Total: {parseInt(b2bPercent || '0') + parseInt(b2cPercent || '0')}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block mb-2">Seasonal Business?</Label>
                      <RadioGroup value={isSeasonalBusiness} onValueChange={setIsSeasonalBusiness}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="seasonal-yes" />
                          <Label htmlFor="seasonal-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="seasonal-no" />
                          <Label htmlFor="seasonal-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Recurring Payments/Subscriptions?</Label>
                      <RadioGroup value={hasRecurringPayments} onValueChange={setHasRecurringPayments}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="recurring-yes" />
                          <Label htmlFor="recurring-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="recurring-no" />
                          <Label htmlFor="recurring-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  {hasRecurringPayments === 'Yes' && (
                    <div className="grid gap-2">
                      <Label htmlFor="recurringPaymentsDetails">Specify Recurring Payments</Label>
                      <Input
                        id="recurringPaymentsDetails"
                        value={recurringPaymentsDetails}
                        onChange={(e) => setRecurringPaymentsDetails(e.target.value)}
                        placeholder="Describe recurring payment details"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="refund-policy">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">11. Refund / Cancellation Policy</h3>
                  
                  <div>
                    <Label className="block mb-2">Do you have a refund policy?</Label>
                    <RadioGroup value={hasRefundPolicy} onValueChange={setHasRefundPolicy}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="refund-yes" />
                        <Label htmlFor="refund-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="refund-no" />
                        <Label htmlFor="refund-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {hasRefundPolicy === 'Yes' && (
                    <div>
                      <Label className="block mb-2">Policy Type</Label>
                      <RadioGroup value={refundPolicyType} onValueChange={setRefundPolicyType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Exchange" id="exchange" />
                          <Label htmlFor="exchange">Exchange</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Store Credit" id="store-credit" />
                          <Label htmlFor="store-credit">Store Credit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Refund within 30 days" id="refund-30" />
                          <Label htmlFor="refund-30">Refund within 30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="refund-other" />
                          <Label htmlFor="refund-other">Other</Label>
                        </div>
                      </RadioGroup>
                      
                      {refundPolicyType === 'Other' && (
                        <div className="mt-2 grid gap-2">
                          <Label htmlFor="otherRefundPolicy">Specify Other Refund Policy</Label>
                          <Input
                            id="otherRefundPolicy"
                            value={otherRefundPolicy}
                            onChange={(e) => setOtherRefundPolicy(e.target.value)}
                            placeholder="Enter refund policy details"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Label className="block mb-2">Processing History?</Label>
                    <RadioGroup value={hasProcessingHistory} onValueChange={setHasProcessingHistory}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="history-yes" />
                        <Label htmlFor="history-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="history-no" />
                        <Label htmlFor="history-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {hasProcessingHistory === 'Yes' && (
                      <p className="text-sm text-gray-500 mt-2">
                        Please attach 3 most recent processing statements.
                      </p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="previousProcessor">Current/Previous Processor(s)</Label>
                    <Input
                      id="previousProcessor"
                      value={previousProcessor}
                      onChange={(e) => setPreviousProcessor(e.target.value)}
                      placeholder="Enter previous processor(s)"
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Previous Terminations?</Label>
                    <RadioGroup value={hasPreviousTerminations} onValueChange={setHasPreviousTerminations}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="terminations-yes" />
                        <Label htmlFor="terminations-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="terminations-no" />
                        <Label htmlFor="terminations-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {hasPreviousTerminations === 'Yes' && (
                      <div className="mt-2 grid gap-2">
                        <Label htmlFor="terminationsExplanation">Explain</Label>
                        <Input
                          id="terminationsExplanation"
                          value={terminationsExplanation}
                          onChange={(e) => setTerminationsExplanation(e.target.value)}
                          placeholder="Explain previous terminations"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Bankruptcies?</Label>
                    <RadioGroup value={hasBankruptcies} onValueChange={setHasBankruptcies}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="bankruptcies-yes" />
                        <Label htmlFor="bankruptcies-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="bankruptcies-no" />
                        <Label htmlFor="bankruptcies-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {hasBankruptcies === 'Yes' && (
                      <div className="mt-2 grid gap-2">
                        <Label htmlFor="bankruptciesExplanation">Explain</Label>
                        <Input
                          id="bankruptciesExplanation"
                          value={bankruptciesExplanation}
                          onChange={(e) => setBankruptciesExplanation(e.target.value)}
                          placeholder="Explain bankruptcies"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ecommerce">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">13. eCommerce / Card-Not-Present</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="productPurchaseAddresses">Product Purchase Address(es)</Label>
                    <Input
                      id="productPurchaseAddresses"
                      value={productPurchaseAddresses}
                      onChange={(e) => setProductPurchaseAddresses(e.target.value)}
                      placeholder="Enter purchase address(es)"
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Who Owns Inventory?</Label>
                    <RadioGroup value={inventoryOwner} onValueChange={setInventoryOwner}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Merchant" id="merchant-inventory" />
                        <Label htmlFor="merchant-inventory">Merchant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Vendor (Drop Ship)" id="vendor-inventory" />
                        <Label htmlFor="vendor-inventory">Vendor (Drop Ship)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fulfillmentProviders">Fulfillment Provider(s)</Label>
                    <Input
                      id="fulfillmentProviders"
                      value={fulfillmentProviders}
                      onChange={(e) => setFulfillmentProviders(e.target.value)}
                      placeholder="Enter fulfillment provider(s)"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="shoppingCartPlatforms">Shopping Cart / CRM Platform(s)</Label>
                    <Input
                      id="shoppingCartPlatforms"
                      value={shoppingCartPlatforms}
                      onChange={(e) => setShoppingCartPlatforms(e.target.value)}
                      placeholder="Enter platform(s)"
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">How Do Customers Purchase?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="purchase-inperson" 
                          checked={purchaseMethods.includes('In Person')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPurchaseMethods([...purchaseMethods, 'In Person']);
                            } else {
                              setPurchaseMethods(purchaseMethods.filter(m => m !== 'In Person'));
                            }
                          }} 
                        />
                        <Label htmlFor="purchase-inperson">In Person</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="purchase-mail" 
                          checked={purchaseMethods.includes('Mail/Phone')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPurchaseMethods([...purchaseMethods, 'Mail/Phone']);
                            } else {
                              setPurchaseMethods(purchaseMethods.filter(m => m !== 'Mail/Phone'));
                            }
                          }}
                        />
                        <Label htmlFor="purchase-mail">Mail/Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="purchase-internet" 
                          checked={purchaseMethods.includes('Internet')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPurchaseMethods([...purchaseMethods, 'Internet']);
                            } else {
                              setPurchaseMethods(purchaseMethods.filter(m => m !== 'Internet'));
                            }
                          }}
                        />
                        <Label htmlFor="purchase-internet">Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="purchase-fax" 
                          checked={purchaseMethods.includes('Fax')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPurchaseMethods([...purchaseMethods, 'Fax']);
                            } else {
                              setPurchaseMethods(purchaseMethods.filter(m => m !== 'Fax'));
                            }
                          }}
                        />
                        <Label htmlFor="purchase-fax">Fax</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="purchase-other" 
                          checked={purchaseMethods.includes('Other')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPurchaseMethods([...purchaseMethods, 'Other']);
                            } else {
                              setPurchaseMethods(purchaseMethods.filter(m => m !== 'Other'));
                            }
                          }}
                        />
                        <Label htmlFor="purchase-other">Other</Label>
                      </div>
                    </div>
                    
                    {purchaseMethods.includes('Other') && (
                      <div className="mt-2 grid gap-2">
                        <Label htmlFor="otherPurchaseMethod">Specify Other Purchase Method</Label>
                        <Input
                          id="otherPurchaseMethod"
                          value={otherPurchaseMethod}
                          onChange={(e) => setOtherPurchaseMethod(e.target.value)}
                          placeholder="Enter purchase method"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="callCenterProviders">Call Center Provider(s)</Label>
                    <Input
                      id="callCenterProviders"
                      value={callCenterProviders}
                      onChange={(e) => setCallCenterProviders(e.target.value)}
                      placeholder="Enter call center provider(s)"
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Authorization to Shipment Timeframe</Label>
                    <RadioGroup value={authToShipTimeframe} onValueChange={setAuthToShipTimeframe}>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-7 days" id="ship-0-7" />
                          <Label htmlFor="ship-0-7">0–7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="8-14 days" id="ship-8-14" />
                          <Label htmlFor="ship-8-14">8–14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15-30 days" id="ship-15-30" />
                          <Label htmlFor="ship-15-30">15–30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-90 days" id="ship-30-90" />
                          <Label htmlFor="ship-30-90">30–90 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90+ days" id="ship-90plus" />
                          <Label htmlFor="ship-90plus">90+ days</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Delivery Timeframe to Customer</Label>
                    <RadioGroup value={deliveryTimeframe} onValueChange={setDeliveryTimeframe}>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-7 days" id="delivery-0-7" />
                          <Label htmlFor="delivery-0-7">0–7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="8-14 days" id="delivery-8-14" />
                          <Label htmlFor="delivery-8-14">8–14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15-30 days" id="delivery-15-30" />
                          <Label htmlFor="delivery-15-30">15–30 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-90 days" id="delivery-30-90" />
                          <Label htmlFor="delivery-30-90">30–90 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90+ days" id="delivery-90plus" />
                          <Label htmlFor="delivery-90plus">90+ days</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="chargebackSystem">Chargeback Management System (if any)</Label>
                    <Input
                      id="chargebackSystem"
                      value={chargebackSystem}
                      onChange={(e) => setChargebackSystem(e.target.value)}
                      placeholder="Enter chargeback management system"
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Deposits Required?</Label>
                    <RadioGroup value={requiresDeposits} onValueChange={setRequiresDeposits}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="deposits-yes" />
                        <Label htmlFor="deposits-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="deposits-no" />
                        <Label htmlFor="deposits-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {requiresDeposits === 'Yes' && (
                      <div className="mt-2 grid gap-2">
                        <Label htmlFor="depositPercent">% Required</Label>
                        <div className="flex items-center">
                          <Input
                            id="depositPercent"
                            value={depositPercent}
                            onChange={(e) => setDepositPercent(e.target.value)}
                            placeholder="Enter percentage"
                            type="number"
                            min="0"
                            max="100"
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block mb-2">When is Full Payment Received?</Label>
                    <RadioGroup value={paymentTiming} onValueChange={setPaymentTiming}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="100% Paid in Advance" id="payment-advance" />
                        <Label htmlFor="payment-advance">100% Paid in Advance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="100% Paid on Delivery/Completion" id="payment-delivery" />
                        <Label htmlFor="payment-delivery">100% Paid on Delivery/Completion</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="salesRegions">Sales Regions</Label>
                    <Input
                      id="salesRegions"
                      value={salesRegions}
                      onChange={(e) => setSalesRegions(e.target.value)}
                      placeholder="Enter sales regions"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="internationalPercent">% of International Transactions</Label>
                    <div className="flex items-center">
                      <Input
                        id="internationalPercent"
                        value={internationalPercent}
                        onChange={(e) => setInternationalPercent(e.target.value)}
                        placeholder="Enter percentage"
                        type="number"
                        min="0"
                        max="100"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Shipping Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="shipping-fedex" 
                          checked={shippingMethods.includes('FedEx')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setShippingMethods([...shippingMethods, 'FedEx']);
                            } else {
                              setShippingMethods(shippingMethods.filter(m => m !== 'FedEx'));
                            }
                          }} 
                        />
                        <Label htmlFor="shipping-fedex">FedEx</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="shipping-ups" 
                          checked={shippingMethods.includes('UPS')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setShippingMethods([...shippingMethods, 'UPS']);
                            } else {
                              setShippingMethods(shippingMethods.filter(m => m !== 'UPS'));
                            }
                          }}
                        />
                        <Label htmlFor="shipping-ups">UPS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="shipping-usps" 
                          checked={shippingMethods.includes('USPS')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setShippingMethods([...shippingMethods, 'USPS']);
                            } else {
                              setShippingMethods(shippingMethods.filter(m => m !== 'USPS'));
                            }
                          }}
                        />
                        <Label htmlFor="shipping-usps">USPS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="shipping-other" 
                          checked={shippingMethods.includes('Other')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setShippingMethods([...shippingMethods, 'Other']);
                            } else {
                              setShippingMethods(shippingMethods.filter(m => m !== 'Other'));
                            }
                          }}
                        />
                        <Label htmlFor="shipping-other">Other</Label>
                      </div>
                    </div>
                    
                    {shippingMethods.includes('Other') && (
                      <div className="mt-2 grid gap-2">
                        <Label htmlFor="otherShippingMethod">Specify Other Shipping Method</Label>
                        <Input
                          id="otherShippingMethod"
                          value={otherShippingMethod}
                          onChange={(e) => setOtherShippingMethod(e.target.value)}
                          placeholder="Enter shipping method"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Advertising Channels</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="adv-catalog" 
                          checked={advertisingChannels.includes('Catalog')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAdvertisingChannels([...advertisingChannels, 'Catalog']);
                            } else {
                              setAdvertisingChannels(advertisingChannels.filter(c => c !== 'Catalog'));
                            }
                          }} 
                        />
                        <Label htmlFor="adv-catalog">Catalog</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="adv-tv" 
                          checked={advertisingChannels.includes('TV/Radio')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAdvertisingChannels([...advertisingChannels, 'TV/Radio']);
                            } else {
                              setAdvertisingChannels(advertisingChannels.filter(c => c !== 'TV/Radio'));
                            }
                          }}
                        />
                        <Label htmlFor="adv-tv">TV/Radio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="adv-flyers" 
                          checked={advertisingChannels.includes('Flyers/Direct Mail')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAdvertisingChannels([...advertisingChannels, 'Flyers/Direct Mail']);
                            } else {
                              setAdvertisingChannels(advertisingChannels.filter(c => c !== 'Flyers/Direct Mail'));
                            }
                          }}
                        />
                        <Label htmlFor="adv-flyers">Flyers/Direct Mail</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="adv-internet" 
                          checked={advertisingChannels.includes('Internet')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAdvertisingChannels([...advertisingChannels, 'Internet']);
                            } else {
                              setAdvertisingChannels(advertisingChannels.filter(c => c !== 'Internet'));
                            }
                          }}
                        />
                        <Label htmlFor="adv-internet">Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="adv-other" 
                          checked={advertisingChannels.includes('Other')} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAdvertisingChannels([...advertisingChannels, 'Other']);
                            } else {
                              setAdvertisingChannels(advertisingChannels.filter(c => c !== 'Other'));
                            }
                          }}
                        />
                        <Label htmlFor="adv-other">Other</Label>
                      </div>
                    </div>
                    
                    {advertisingChannels.includes('Other') && (
                      <div className="mt-2 grid gap-2">
                        <Label htmlFor="otherAdvertisingChannel">Specify Other Advertising Channel</Label>
                        <Input
                          id="otherAdvertisingChannel"
                          value={otherAdvertisingChannel}
                          onChange={(e) => setOtherAdvertisingChannel(e.target.value)}
                          placeholder="Enter advertising channel"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Warranty / Guarantee Provided By</Label>
                    <RadioGroup value={warrantyProvider} onValueChange={setWarrantyProvider}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Merchant" id="warranty-merchant" />
                        <Label htmlFor="warranty-merchant">Merchant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Manufacturer" id="warranty-manufacturer" />
                        <Label htmlFor="warranty-manufacturer">Manufacturer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex justify-center sm:justify-start gap-2 mt-4 sm:mt-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
          <div className="flex justify-center sm:justify-end gap-2">
            <Button
              type="button"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleGenerate}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Document'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
