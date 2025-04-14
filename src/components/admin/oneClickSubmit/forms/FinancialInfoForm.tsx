
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link2, Upload, ExternalLink, Check } from 'lucide-react';

export const FinancialInfoForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel>Bank Name</FormLabel>
          <Input placeholder="e.g. Chase Bank" />
        </div>
        
        <div>
          <FormLabel>Account Type</FormLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Business Checking</SelectItem>
              <SelectItem value="savings">Business Savings</SelectItem>
              <SelectItem value="personal-checking">Personal Checking</SelectItem>
              <SelectItem value="personal-savings">Personal Savings</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <FormLabel>Routing Number</FormLabel>
          <Input placeholder="9 digits" />
        </div>
        
        <div>
          <FormLabel>Account Number</FormLabel>
          <Input placeholder="Account number" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <h3 className="text-lg font-medium">Connect Your Bank Account</h3>
          <p className="text-sm text-muted-foreground md:text-right">
            Securely connect your bank account for faster verification
          </p>
        </div>
        
        <Card className="p-4 border-dashed">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h4 className="text-md font-medium">Connect via Plaid</h4>
              <p className="text-sm text-muted-foreground">
                Securely connect your bank account for faster verification and easier data management
              </p>
            </div>
            <Button className="bg-[#0A85EA] hover:bg-[#0A85EA]/90">
              <Link2 className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </div>
        </Card>
        
        <p className="text-sm text-center">-- OR --</p>
        
        <div className="space-y-4">
          <h4 className="text-md font-medium">Upload Bank Statements</h4>
          <p className="text-sm text-muted-foreground">
            Please upload the last 3 months of bank statements
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
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Upload Voided Check</p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or PDF, max 5MB
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Upload Image
            </Button>
          </div>
          
          <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Bank Letter (Optional)</p>
            <p className="text-xs text-gray-500 mt-1">
              Bank letter confirming account
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Upload Document
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Summary</h3>
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Annual Revenue</p>
              <Input type="number" placeholder="0.00" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Years Profitable</p>
              <Input type="number" placeholder="0" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Credit Score Range</p>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (750+)</SelectItem>
                  <SelectItem value="good">Good (700-749)</SelectItem>
                  <SelectItem value="fair">Fair (650-699)</SelectItem>
                  <SelectItem value="poor">Poor (600-649)</SelectItem>
                  <SelectItem value="very-poor">Very Poor (below 600)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Monthly Operating Expenses</p>
              <Input type="number" placeholder="0.00" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialInfoForm;
