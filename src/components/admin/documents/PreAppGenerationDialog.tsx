
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileText, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndustries, generatePreApp } from './api';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preAppFormSchema, type PreAppFormValues } from './PreAppFormSchema';

interface Industry {
  id: string;
  name: string;
  description?: string;
}

interface PreAppGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PreAppGenerationDialog: React.FC<PreAppGenerationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('structure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leadData, setLeadData] = useState(null);

  const form = useForm<PreAppFormValues>({
    resolver: zodResolver(preAppFormSchema),
    defaultValues: {
      businessStructure: 'llc',
      hasRefundPolicy: true,
      purchaseMethods: [],
      shippingMethod: [],
      advertisingChannels: [],
      additionalOwners: false,
    },
  });

  // Fetch industries with proper typing
  const { data: industries, isLoading: industriesLoading } = useQuery<Industry[]>({
    queryKey: ['industries'],
    queryFn: fetchIndustries,
  });

  const handleGenerate = async (data: PreAppFormValues) => {
    if (!selectedIndustryId) {
      toast.error('Please select an industry');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Generate Pre-App PDF
      await generatePreApp(selectedIndustryId, leadData, data);
      
      toast.success('Merchant application generated successfully');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error generating pre-app:', error);
      toast.error(`Failed to generate merchant application: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const goToNextTab = () => {
    if (activeTab === 'structure') setActiveTab('business');
    else if (activeTab === 'business') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('volume');
    else if (activeTab === 'volume') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('ecommerce');
  };

  const goToPrevTab = () => {
    if (activeTab === 'ecommerce') setActiveTab('policies');
    else if (activeTab === 'policies') setActiveTab('volume');
    else if (activeTab === 'volume') setActiveTab('banking');
    else if (activeTab === 'banking') setActiveTab('principal');
    else if (activeTab === 'principal') setActiveTab('business');
    else if (activeTab === 'business') setActiveTab('structure');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0EA5E9] flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            WaveLine Merchant Application
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Label htmlFor="industry" className="block font-medium mb-1">Select Industry</Label>
          <Select value={selectedIndustryId} onValueChange={setSelectedIndustryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industriesLoading ? (
                <SelectItem value="loading" disabled>Loading industries...</SelectItem>
              ) : industries && industries.length > 0 ? (
                industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No industries available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-7 mb-4">
                <TabsTrigger value="structure" className="text-xs md:text-sm">Structure</TabsTrigger>
                <TabsTrigger value="business" className="text-xs md:text-sm">Business</TabsTrigger>
                <TabsTrigger value="principal" className="text-xs md:text-sm">Principal</TabsTrigger>
                <TabsTrigger value="banking" className="text-xs md:text-sm">Banking</TabsTrigger>
                <TabsTrigger value="volume" className="text-xs md:text-sm">Volume</TabsTrigger>
                <TabsTrigger value="policies" className="text-xs md:text-sm">Policies</TabsTrigger>
                <TabsTrigger value="ecommerce" className="text-xs md:text-sm">eCommerce</TabsTrigger>
              </TabsList>

              {/* Tab 1: Business Structure */}
              <TabsContent value="structure" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">1. Business Structure</h3>
                  
                  <FormField
                    control={form.control}
                    name="businessStructure"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Business Structure</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sole_proprietorship" id="sole_proprietorship" />
                                  <Label htmlFor="sole_proprietorship">Sole Proprietorship</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="corporation" id="corporation" />
                                  <Label htmlFor="corporation">Corporation</Label>
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
                                  <RadioGroupItem value="government" id="government" />
                                  <Label htmlFor="government">Government</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="other" id="other" />
                                  <Label htmlFor="other">Other</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch('businessStructure') === 'other' && (
                    <FormField
                      control={form.control}
                      name="businessStructureOther"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Please specify</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Specify other business structure" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 2: Business Information */}
              <TabsContent value="business" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">2. Business Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street (Location) Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Street address" />
                          </FormControl>
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
                            <Input {...field} placeholder="Mailing address" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business/Contact Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Business phone" />
                          </FormControl>
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
                            <Input {...field} placeholder="Business email" type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessFax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Fax #</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Business fax" />
                          </FormControl>
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
                            <Input {...field} placeholder="Customer service phone" />
                          </FormControl>
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
                            <Input {...field} placeholder="Customer service email" type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website/URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Website URL (without http://)" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">3. Authorized Contact</h3>
                  <FormField
                    control={form.control}
                    name="authorizedContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Full name of authorized contact" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">4. Equipment / Software</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="terminalGateway"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terminal/Gateway Used</FormLabel>
                          <FormDescription>e.g., VX 520, Authorize.net, NMI</FormDescription>
                          <FormControl>
                            <Input {...field} placeholder="Terminal or gateway used" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shoppingCart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shopping Cart (if applicable)</FormLabel>
                          <FormDescription>If using Shopify, request Authorize.net Gateway</FormDescription>
                          <FormControl>
                            <Input {...field} placeholder="Shopping cart platform" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">5. Business Location</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Employees</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Number of employees" type="text" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="locationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Type</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  value={field.value || ''}
                                  className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="home" id="home_location" />
                                    <Label htmlFor="home_location">Home/Residential</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="office" id="office_location" />
                                    <Label htmlFor="office_location">Office/Business District</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="storefront" id="storefront_location" />
                                    <Label htmlFor="storefront_location">Storefront</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ownOrRent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Own or Rent</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  value={field.value || ''}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="own" id="own_location" />
                                    <Label htmlFor="own_location">Own</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="rent" id="rent_location" />
                                    <Label htmlFor="rent_location">Rent</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="squareFootage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approx. Square Footage</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  value={field.value || ''}
                                  className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="0-500" id="footage_0_500" />
                                    <Label htmlFor="footage_0_500">0–500 ft²</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="501-2000" id="footage_501_2000" />
                                    <Label htmlFor="footage_501_2000">501–2,000 ft²</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="2001-5000" id="footage_2001_5000" />
                                    <Label htmlFor="footage_2001_5000">2,001–5,000 ft²</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="5000+" id="footage_5000_plus" />
                                    <Label htmlFor="footage_5000_plus">5,000+ ft²</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={goToPrevTab} variant="outline">
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 3: Principal Information */}
              <TabsContent value="principal" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">6. Principal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="principalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Principal's full name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <FormField
                        control={form.control}
                        name="ownershipPercentage"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Ownership %</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ownership percentage" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="additionalOwners"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 mt-2 md:mt-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                                id="additional-owners"
                              />
                            </FormControl>
                            <FormLabel htmlFor="additional-owners" className="text-sm font-normal">
                              Additional owners with 25%+ equity
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="principalTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Owner, CEO, etc.)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Principal's title" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="principalPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Home phone number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 mb-4">
                    <FormLabel>Date of Birth</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name="dateOfBirthMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="MM" maxLength={2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirthDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="DD" maxLength={2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirthYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="YYYY" maxLength={4} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ssn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SSN</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Social Security Number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="driversLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License #</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Driver's license number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>License Expiration Date</FormLabel>
                      <div className="grid grid-cols-3 gap-1">
                        <FormField
                          control={form.control}
                          name="licenseExpMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="MM" maxLength={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="licenseExpDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="DD" maxLength={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="licenseExpYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="YYYY" maxLength={4} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="licenseState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="State" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="principalAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Home address" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="principalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Personal email" type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={goToPrevTab} variant="outline">
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 4: Banking Info */}
              <TabsContent value="banking" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">7. Bank Settlement Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Bank name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bankContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name at Bank</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Contact name at bank" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Routing number" />
                          </FormControl>
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
                            <Input {...field} placeholder="Account number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">8. Business Description</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productsServices"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Products/Services Sold</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe products or services" rows={3} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="yearsInOperation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years in Operation</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Years in operation" />
                          </FormControl>
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
                            <Input {...field} placeholder="Storage location" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={goToPrevTab} variant="outline">
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 5: Processing Volume */}
              <TabsContent value="volume" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">9. Processing Volume</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalMonthlyVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Total Monthly Volume (All payment types)</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <FormControl>
                              <Input {...field} placeholder="0.00" className="pl-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="visaMastercardVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visa/Mastercard Volume</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <FormControl>
                              <Input {...field} placeholder="0.00" className="pl-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amexVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>American Express Volume</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <FormControl>
                              <Input {...field} placeholder="0.00" className="pl-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="averageTicket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Ticket</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <FormControl>
                              <Input {...field} placeholder="0.00" className="pl-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="highestTicket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Ticket</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <FormControl>
                              <Input {...field} placeholder="0.00" className="pl-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">10. Transaction Method (Must Equal 100%)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="faceToFacePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Face-to-Face (Retail)</FormLabel>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <FormControl>
                              <Input {...field} placeholder="0" className="pr-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="motoPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone/Mail/Email (MOTO)</FormLabel>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <FormControl>
                              <Input {...field} placeholder="0" className="pr-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ecommercePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internet (eCommerce)</FormLabel>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <FormControl>
                              <Input {...field} placeholder="0" className="pr-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={goToPrevTab} variant="outline">
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              {/* Tab 6: Policies */}
              <TabsContent value="policies" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">11. Refund / Cancellation Policy</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="hasRefundPolicy"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Do you have a refund policy?</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="refund_yes" />
                                    <Label htmlFor="refund_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="refund_no" />
                                    <Label htmlFor="refund_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('hasRefundPolicy') && (
                      <FormField
                        control={form.control}
                        name="policyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy Type</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <FormControl>
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  value={field.value || ''}
                                  className="flex flex-col space-y-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="exchange" id="policy_exchange" />
                                    <Label htmlFor="policy_exchange">Exchange</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="store_credit" id="policy_store_credit" />
                                    <Label htmlFor="policy_store_credit">Store Credit</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="refund_30_days" id="policy_refund" />
                                    <Label htmlFor="policy_refund">Refund within 30 days</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="policy_other" />
                                    <Label htmlFor="policy_other">Other</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {form.watch('policyType') === 'other' && (
                      <FormField
                        control={form.control}
                        name="policyTypeOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please specify</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Specify other policy type" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="hasProcessingHistory"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Processing History?</FormLabel>
                          <FormDescription>(if yes, attach 3 most recent processing statements)</FormDescription>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="history_yes" />
                                    <Label htmlFor="history_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="history_no" />
                                    <Label htmlFor="history_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currentPreviousProcessors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current/Previous Processor(s)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="List current or previous payment processors" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasPreviousTerminations"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Previous Terminations?</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="terminations_yes" />
                                    <Label htmlFor="terminations_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="terminations_no" />
                                    <Label htmlFor="terminations_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('hasPreviousTerminations') && (
                      <FormField
                        control={form.control}
                        name="terminationsExplanation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please explain</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Explain previous terminations" rows={2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="hasBankruptcies"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Bankruptcies?</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="bankruptcies_yes" />
                                    <Label htmlFor="bankruptcies_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="bankruptcies_no" />
                                    <Label htmlFor="bankruptcies_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('hasBankruptcies') && (
                      <FormField
                        control={form.control}
                        name="bankruptciesExplanation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please explain</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Explain bankruptcy history" rows={2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mt-6 mb-4">12. Business Type</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="b2bPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>B2B (%)</FormLabel>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <FormControl>
                              <Input {...field} placeholder="0" className="pr-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="b2cPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>B2C (%)</FormLabel>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <FormControl>
                              <Input {...field} placeholder="0" className="pr-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isSeasonalBusiness"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Seasonal Business?</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="seasonal_yes" />
                                    <Label htmlFor="seasonal_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="seasonal_no" />
                                    <Label htmlFor="seasonal_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasRecurringPayments"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Recurring Payments/Subscriptions?</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="recurring_yes" />
                                    <Label htmlFor="recurring_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="recurring_no" />
                                    <Label htmlFor="recurring_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('hasRecurringPayments') && (
                      <FormField
                        control={form.control}
                        name="recurringPaymentsDetails"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Please specify</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Specify recurring payment details" rows={2} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={goToPrevTab} variant="outline">
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
                    Next
                  </Button>
                </div>
              </TabsContent>
              
              {/* Tab 7: eCommerce */}
              <TabsContent value="ecommerce" className="space-y-4">
                <div className="bg-[#0EA5E9]/5 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-xl text-[#0EA5E9] mb-4">13. eCommerce / Card-Not-Present</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productPurchaseAddresses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Purchase Address(es)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Address(es) where products are purchased" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="inventoryOwnership"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Who Owns Inventory?</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value || ''}
                                className="flex flex-row space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="merchant" id="inventory_merchant" />
                                  <Label htmlFor="inventory_merchant">Merchant</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="vendor" id="inventory_vendor" />
                                  <Label htmlFor="inventory_vendor">Vendor (Drop Ship)</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fulfillmentProviders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fulfillment Provider(s)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Fulfillment providers" />
                          </FormControl>
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
                            <Input {...field} placeholder="Shopping cart or CRM platforms" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="purchaseMethods"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>How Do Customers Purchase?</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-4">
                              {[
                                { value: 'in_person', label: 'In Person' },
                                { value: 'mail_phone', label: 'Mail/Phone' },
                                { value: 'internet', label: 'Internet' },
                                { value: 'fax', label: 'Fax' },
                                { value: 'other', label: 'Other' }
                              ].map((method) => (
                                <div key={method.value} className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={field.value?.includes(method.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...(field.value || []), method.value]);
                                      } else {
                                        field.onChange(field.value?.filter((value: string) => value !== method.value));
                                      }
                                    }}
                                    id={`purchase_method_${method.value}`}
                                  />
                                  <Label htmlFor={`purchase_method_${method.value}`} className="text-sm font-normal">
                                    {method.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('purchaseMethods')?.includes('other') && (
                      <FormField
                        control={form.control}
                        name="purchaseMethodsOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Purchase Methods</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Specify other purchase methods" />
                            </FormControl>
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
                            <Input {...field} placeholder="Call center providers" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="authToShipTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authorization to Shipment Timeframe</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value || ''}
                                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="0-7" id="auth_ship_0_7" />
                                  <Label htmlFor="auth_ship_0_7">0–7 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="8-14" id="auth_ship_8_14" />
                                  <Label htmlFor="auth_ship_8_14">8–14 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="15-30" id="auth_ship_15_30" />
                                  <Label htmlFor="auth_ship_15_30">15–30 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="30-90" id="auth_ship_30_90" />
                                  <Label htmlFor="auth_ship_30_90">30–90 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="90+" id="auth_ship_90_plus" />
                                  <Label htmlFor="auth_ship_90_plus">90+ days</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deliveryTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Timeframe to Customer</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value || ''}
                                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="0-7" id="delivery_0_7" />
                                  <Label htmlFor="delivery_0_7">0–7 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="8-14" id="delivery_8_14" />
                                  <Label htmlFor="delivery_8_14">8–14 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="15-30" id="delivery_15_30" />
                                  <Label htmlFor="delivery_15_30">15–30 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="30-90" id="delivery_30_90" />
                                  <Label htmlFor="delivery_30_90">30–90 days</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="90+" id="delivery_90_plus" />
                                  <Label htmlFor="delivery_90_plus">90+ days</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="chargebackManagement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chargeback Management System (if any)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Chargeback management system" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="depositsRequired"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Deposits Required?</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroup 
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="deposits_yes" />
                                    <Label htmlFor="deposits_yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="deposits_no" />
                                    <Label htmlFor="deposits_no">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('depositsRequired') && (
                      <FormField
                        control={form.control}
                        name="depositPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Percentage Required</FormLabel>
                            <div className="relative">
                              <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                              <FormControl>
                                <Input {...field} placeholder="0" className="pr-8" />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="fullPaymentTiming"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When is Full Payment Received?</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value || ''}
                                className="flex flex-row space-x-4"
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
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salesRegions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales Regions</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Regions where sales occur" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="internationalTransactionsPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>% of International Transactions</FormLabel>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <FormControl>
                              <Input {...field} placeholder="0" className="pr-8" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Shipping Method</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-4">
                              {[
                                { value: 'fedex', label: 'FedEx' },
                                { value: 'ups', label: 'UPS' },
                                { value: 'usps', label: 'USPS' },
                                { value: 'other', label: 'Other' }
                              ].map((method) => (
                                <div key={method.value} className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={field.value?.includes(method.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...(field.value || []), method.value]);
                                      } else {
                                        field.onChange(field.value?.filter((value: string) => value !== method.value));
                                      }
                                    }}
                                    id={`shipping_method_${method.value}`}
                                  />
                                  <Label htmlFor={`shipping_method_${method.value}`} className="text-sm font-normal">
                                    {method.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('shippingMethod')?.includes('other') && (
                      <FormField
                        control={form.control}
                        name="shippingMethodOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Shipping Methods</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Specify other shipping methods" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="advertisingChannels"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Advertising Channels</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-4">
                              {[
                                { value: 'catalog', label: 'Catalog' },
                                { value: 'tv_radio', label: 'TV/Radio' },
                                { value: 'direct_mail', label: 'Flyers/Direct Mail' },
                                { value: 'internet', label: 'Internet' },
                                { value: 'other', label: 'Other' }
                              ].map((channel) => (
                                <div key={channel.value} className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={field.value?.includes(channel.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...(field.value || []), channel.value]);
                                      } else {
                                        field.onChange(field.value?.filter((value: string) => value !== channel.value));
                                      }
                                    }}
                                    id={`ad_channel_${channel.value}`}
                                  />
                                  <Label htmlFor={`ad_channel_${channel.value}`} className="text-sm font-normal">
                                    {channel.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('advertisingChannels')?.includes('other') && (
                      <FormField
                        control={form.control}
                        name="advertisingChannelsOther"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Advertising Channels</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Specify other advertising channels" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="warrantyProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty / Guarantee Provided By</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value || ''}
                                className="flex flex-row space-x-4"
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
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={goToPrevTab} variant="outline">
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Application'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
