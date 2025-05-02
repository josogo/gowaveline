
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Upload, Link2, AlertCircle } from 'lucide-react';

export const ProcessingInfoForm: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  
  // Watch values to properly handle select and switch components
  const previousTermination = watch('processing.previousTermination') || false;
  const reservesHeld = watch('processing.reservesHeld') || false;
  const excessiveChargebacks = watch('processing.excessiveChargebacks') || false;
  const currentProcessor = watch('processing.currentProcessor') || '';
  
  // Custom handlers for components that don't work directly with register
  const handleProcessorChange = (value: string) => {
    setValue('processing.currentProcessor', value, { shouldDirty: true });
  };
  
  const handleSwitchChange = (field: string, checked: boolean) => {
    setValue(`processing.${field}`, checked, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="processing.currentProcessor">Current Payment Processor</Label>
          <Select 
            value={currentProcessor} 
            onValueChange={handleProcessorChange}
          >
            <SelectTrigger id="processing.currentProcessor">
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
          <Label htmlFor="processing.yearsWithProcessor">Years With Current Processor</Label>
          <Input 
            id="processing.yearsWithProcessor" 
            type="number" 
            placeholder="0" 
            {...register('processing.yearsWithProcessor')}
          />
        </div>
        
        <div>
          <Label htmlFor="processing.monthlyVolume">Monthly Processing Volume</Label>
          <Input 
            id="processing.monthlyVolume" 
            type="number" 
            placeholder="0.00" 
            {...register('processing.monthlyVolume')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Average monthly credit card volume
          </p>
        </div>
        
        <div>
          <Label htmlFor="processing.avgTransactionSize">Average Transaction Size</Label>
          <Input 
            id="processing.avgTransactionSize" 
            type="number" 
            placeholder="0.00" 
            {...register('processing.avgTransactionSize')}
          />
        </div>
        
        <div>
          <Label htmlFor="processing.currentRate">Current Processing Rate</Label>
          <div className="flex space-x-2">
            <Input 
              id="processing.currentRate" 
              type="number" 
              placeholder="0.00" 
              className="w-1/2" 
              {...register('processing.currentRate')}
            />
            <div className="w-1/2 flex items-center bg-gray-100 px-3 rounded-md text-sm">
              %
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="processing.monthlyTransactionCount">Monthly Transaction Count</Label>
          <Input 
            id="processing.monthlyTransactionCount" 
            type="number" 
            placeholder="0" 
            {...register('processing.monthlyTransactionCount')}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Processing History</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="processing.previousTermination"
            checked={previousTermination}
            onCheckedChange={(checked) => handleSwitchChange('previousTermination', checked)}
          />
          <Label htmlFor="processing.previousTermination" className="cursor-pointer">
            Previously terminated by a processor
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="processing.reservesHeld"
            checked={reservesHeld}
            onCheckedChange={(checked) => handleSwitchChange('reservesHeld', checked)}
          />
          <Label htmlFor="processing.reservesHeld" className="cursor-pointer">
            Currently have reserves held by a processor
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="processing.excessiveChargebacks"
            checked={excessiveChargebacks}
            onCheckedChange={(checked) => handleSwitchChange('excessiveChargebacks', checked)}
          />
          <Label htmlFor="processing.excessiveChargebacks" className="cursor-pointer">
            Had excessive chargebacks in past 6 months
          </Label>
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
