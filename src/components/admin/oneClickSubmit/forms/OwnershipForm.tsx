
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Trash2, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

export const OwnershipForm: React.FC = () => {
  const [owners, setOwners] = useState([
    { id: 1, name: '', title: '', ownership: '', dob: '', ssn: '', address: '', city: '', state: '', zip: '' }
  ]);
  
  const addOwner = () => {
    setOwners(prev => [...prev, {
      id: prev.length + 1,
      name: '',
      title: '',
      ownership: '',
      dob: '',
      ssn: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }]);
  };
  
  const removeOwner = (id: number) => {
    if (owners.length > 1) {
      setOwners(prev => prev.filter(owner => owner.id !== id));
    }
  };
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
        Please provide information for all owners with 25% or more ownership. 
        Banks require this information for KYC (Know Your Customer) compliance.
      </p>

      {owners.map((owner, index) => (
        <Card key={owner.id} className="border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Owner {index + 1}</CardTitle>
              {owners.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeOwner(owner.id)}
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Full legal name" />
              </div>
              
              <div>
                <Label>Title/Position</Label>
                <Input placeholder="e.g. CEO, President" />
              </div>
              
              <div>
                <Label>Ownership Percentage</Label>
                <Input type="number" placeholder="25" />
              </div>
              
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" />
              </div>
              
              <div>
                <Label>SSN/Tax ID</Label>
                <Input placeholder="XXX-XX-XXXX" />
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <h3 className="text-md font-medium">Residential Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Street Address</Label>
                  <Input placeholder="123 Main St" />
                </div>
                
                <div>
                  <Label>Suite/Unit</Label>
                  <Input placeholder="Apt 4B" />
                </div>
                
                <div>
                  <Label>City</Label>
                  <Input placeholder="City" />
                </div>
                
                <div>
                  <Label>State</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                      {/* More states would be added here */}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>ZIP Code</Label>
                  <Input placeholder="12345" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Identity Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Upload Driver's License</p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or PDF, max 5MB
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload ID
                  </Button>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Upload Proof of Address</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recent utility bill or bank statement
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Document
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={addOwner}
          className="w-full max-w-md"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Another Owner
        </Button>
      </div>
    </div>
  );
};

export default OwnershipForm;
