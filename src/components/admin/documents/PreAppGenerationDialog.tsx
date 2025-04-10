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

  // Fetch industries - Add proper typing for the industries data
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
                          FormControl>
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
