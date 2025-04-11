
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form schema
const formSchema = z.object({
  // Section 1: Business Structure
  businessStructure: z.enum(['sole_proprietorship', 'corporation', 'llc', 'non_profit', 'government', 'other']),
  businessStructureOther: z.string().optional(),
  
  // Section 2: Business Info
  businessName: z.string().min(1, "Business name is required"),
  streetAddress: z.string().optional(),
  mailingAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessFax: z.string().optional(),
  customerServicePhone: z.string().optional(),
  customerServiceEmail: z.string().email().optional(),
  website: z.string().optional(),
  
  // Section 3: Principal Info
  principalName: z.string().optional(),
  ownershipPercentage: z.string().optional(),
  principalTitle: z.string().optional(),
  principalPhone: z.string().optional(),
  principalEmail: z.string().email().optional(),
  principalAddress: z.string().optional(),
  
  // Section 4: Banking Info
  bankName: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  
  // Section 5: Processing
  totalMonthlyVolume: z.string().optional(),
  averageTicket: z.string().optional(),
  highestTicket: z.string().optional(),
  
  // Section 6: Business Details
  productsServices: z.string().optional(),
  refundPolicy: z.enum(['yes', 'no']).optional(),
  refundPolicyDetails: z.string().optional(),
  
  // Additional sections would follow the same pattern
});

type FormValues = z.infer<typeof formSchema>;

interface PreAppFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

const PreAppForm: React.FC<PreAppFormProps> = ({ onSubmit, isLoading }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    businessStructure: true,
    businessInfo: false,
    principalInfo: false,
    bankingInfo: false,
    processing: false,
    businessDetails: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessStructure: 'llc',
      businessName: '',
    },
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Business Structure */}
      <Card className="shadow-md border-t-4 border-t-[#0EA5E9]">
        <Collapsible 
          open={openSections.businessStructure} 
          onOpenChange={() => toggleSection('businessStructure')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="bg-gradient-to-r from-[#FEC6A1]/30 to-white cursor-pointer flex flex-row items-center justify-between">
              <CardTitle className="text-[#0EA5E9]">
                Business Structure
              </CardTitle>
              {openSections.businessStructure ? 
                <ChevronUp className="h-5 w-5 text-[#F97316]" /> : 
                <ChevronDown className="h-5 w-5 text-[#F97316]" />
              }
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-4">
              <RadioGroup
                defaultValue="llc"
                onValueChange={(value) => form.setValue('businessStructure', value as any)}
                className="space-y-2"
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
              
              {form.watch('businessStructure') === 'other' && (
                <div className="mt-3">
                  <Label htmlFor="businessStructureOther">Please specify:</Label>
                  <Input 
                    id="businessStructureOther" 
                    {...form.register('businessStructureOther')} 
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Section 2: Business Info */}
      <Card className="shadow-md border-t-4 border-t-[#F97316]">
        <Collapsible 
          open={openSections.businessInfo} 
          onOpenChange={() => toggleSection('businessInfo')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="bg-gradient-to-r from-[#FEC6A1]/30 to-white cursor-pointer flex flex-row items-center justify-between">
              <CardTitle className="text-[#0EA5E9]">
                Business Info
              </CardTitle>
              {openSections.businessInfo ? 
                <ChevronUp className="h-5 w-5 text-[#F97316]" /> : 
                <ChevronDown className="h-5 w-5 text-[#F97316]" />
              }
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input 
                  id="businessName" 
                  {...form.register('businessName')} 
                  className={form.formState.errors.businessName ? "border-red-500" : ""}
                />
                {form.formState.errors.businessName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input id="streetAddress" {...form.register('streetAddress')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mailingAddress">Mailing Address</Label>
                <Input id="mailingAddress" {...form.register('mailingAddress')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input id="businessPhone" {...form.register('businessPhone')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input 
                  id="businessEmail" 
                  type="email" 
                  {...form.register('businessEmail')} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessFax">Business Fax</Label>
                <Input id="businessFax" {...form.register('businessFax')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerServicePhone">Customer Service Phone</Label>
                <Input id="customerServicePhone" {...form.register('customerServicePhone')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerServiceEmail">Customer Service Email</Label>
                <Input 
                  id="customerServiceEmail" 
                  type="email" 
                  {...form.register('customerServiceEmail')} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" {...form.register('website')} />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Section 3: Principal Info */}
      <Card className="shadow-md border-t-4 border-t-[#0EA5E9]">
        <Collapsible 
          open={openSections.principalInfo} 
          onOpenChange={() => toggleSection('principalInfo')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="bg-gradient-to-r from-[#FEC6A1]/30 to-white cursor-pointer flex flex-row items-center justify-between">
              <CardTitle className="text-[#0EA5E9]">
                Principal Info
              </CardTitle>
              {openSections.principalInfo ? 
                <ChevronUp className="h-5 w-5 text-[#F97316]" /> : 
                <ChevronDown className="h-5 w-5 text-[#F97316]" />
              }
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principalName">Principal Name</Label>
                <Input id="principalName" {...form.register('principalName')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principalTitle">Title</Label>
                <Input id="principalTitle" {...form.register('principalTitle')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownershipPercentage">Ownership Percentage</Label>
                <Input id="ownershipPercentage" {...form.register('ownershipPercentage')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principalPhone">Phone</Label>
                <Input id="principalPhone" {...form.register('principalPhone')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principalEmail">Email</Label>
                <Input 
                  id="principalEmail" 
                  type="email" 
                  {...form.register('principalEmail')} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principalAddress">Home Address</Label>
                <Input id="principalAddress" {...form.register('principalAddress')} />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      {/* Additional sections would follow the same pattern */}
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-gradient-to-r from-[#F97316] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#F97316] transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Pre-Application...
          </>
        ) : (
          'Generate Pre-Application'
        )}
      </Button>
    </form>
  );
};

export default PreAppForm;
