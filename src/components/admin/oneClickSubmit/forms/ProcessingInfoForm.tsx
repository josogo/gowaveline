
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Upload, Link2, AlertCircle, ExternalLink } from 'lucide-react';

export const ProcessingInfoForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel>Current Payment Processor</FormLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select processor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="authorize">Authorize.Net</SelectItem>
              <SelectItem value="braintree">Braintree</SelectItem>
              <SelectItem value="nmi">NMI</SelectItem>
              <SelectItem value="first-data">First Data</SelectItem>
              <SelectItem value="none">No Current Processor</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <FormLabel>Years With Current Processor</FormLabel>
          <Input type="number" placeholder="0" />
        </div>
        
        <div>
          <FormLabel>Monthly Processing Volume</FormLabel>
          <Input type="number" placeholder="0.00" />
          <p className="text-xs text-muted-foreground mt-1">
            Average monthly credit card volume
          </p>
        </div>
        
        <div>
          <FormLabel>Average Transaction Size</FormLabel>
          <Input type="number" placeholder="0.00" />
        </div>
        
        <div>
          <FormLabel>Current Processing Rate</FormLabel>
          <div className="flex space-x-2">
            <Input type="number" placeholder="0.00" className="w-1/2" />
            <div className="w-1/2 flex items-center bg-gray-100 px-3 rounded-md text-sm">
              %
            </div>
          </div>
        </div>
        
        <div>
          <FormLabel>Monthly Transaction Count</FormLabel>
          <Input type="number" placeholder="0" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Processing History</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="previous-termination" />
          <FormLabel htmlFor="previous-termination" className="cursor-pointer">
            Previously terminated by a processor
          </FormLabel>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="reserves-held" />
          <FormLabel htmlFor="reserves-held" className="cursor-pointer">
            Currently have reserves held by a processor
          </FormLabel>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch id="excessive-chargebacks" />
          <FormLabel htmlFor="excessive-chargebacks" className="cursor-pointer">
            Had excessive chargebacks in past 6 months
          </FormLabel>
        </div>
      </div>
      
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Why we need processing history</h3>
              <p className="text-sm text-amber-700">
                Your processing history helps us match you with banks that are most likely to approve your application. 
                Being transparent about past issues actually increases your chances of approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <h3 className="text-lg font-medium">Connect Your Processor</h3>
          <p className="text-sm text-muted-foreground md:text-right">
            Securely connect your processor for faster verification
          </p>
        </div>
        
        <Card className="p-4 border-dashed">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h4 className="text-md font-medium">Connect via API</h4>
              <p className="text-sm text-muted-foreground">
                Automatically import your processing data for analysis and bank matching
              </p>
            </div>
            <Button className="bg-[#0A85EA] hover:bg-[#0A85EA]/90">
              <Link2 className="mr-2 h-4 w-4" />
              Connect Processor
            </Button>
          </div>
        </Card>
        
        <p className="text-sm text-center">-- OR --</p>
        
        <div className="space-y-4">
          <h4 className="text-md font-medium">Upload Processing Statements</h4>
          <p className="text-sm text-muted-foreground">
            Please upload the last 3 months of processing statements
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center min-h-[160px]">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Most Recent Statement</p>
              <p className="text-xs text-gray-500 mt-1">
                Last month's statement
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upload PDF
              </Button>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center min-h-[160px]">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Previous Month</p>
              <p className="text-xs text-gray-500 mt-1">
                2 months ago
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upload PDF
              </Button>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center min-h-[160px]">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">3 Months Ago</p>
              <p className="text-xs text-gray-500 mt-1">
                Third month back
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upload PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingInfoForm;
