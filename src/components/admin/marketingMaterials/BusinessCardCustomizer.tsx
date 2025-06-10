
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface BusinessCardData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

interface BusinessCardCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: BusinessCardData;
  onSave: (data: BusinessCardData) => void;
}

export const BusinessCardCustomizer: React.FC<BusinessCardCustomizerProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState<BusinessCardData>({
    name: '',
    title: '',
    phone: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    onSave(formData);
    toast.success('Business card information saved successfully');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Business Card</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior Payment Consultant"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.company.com"
              />
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            
            {/* Front Side Preview */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 rounded-lg text-white shadow-lg">
              <div className="flex flex-col h-24">
                <div className="flex items-center justify-between">
                  <img 
                    src="/lovable-uploads/1e017aad-3d36-4922-992f-f27b55733ec4.png" 
                    alt="Company Logo" 
                    className="h-6 w-auto"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-xs font-medium opacity-90">
                    Your Partner in High-Risk Merchant Services
                  </p>
                </div>
              </div>
            </div>
            
            {/* Back Side Preview */}
            <div className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-lg">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900">
                  {formData.name || '[Your Name]'}
                </h4>
                <p className="text-gray-600 text-xs">
                  {formData.title || '[Your Title]'}
                </p>
                <div className="pt-1 space-y-0.5 text-xs text-gray-700">
                  <p>📞 {formData.phone || '[Your Phone Number]'}</p>
                  <p>✉️ {formData.email || '[Your Email]'}</p>
                  <p>🌐 {formData.website || '[Company Website]'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            Save Information
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
