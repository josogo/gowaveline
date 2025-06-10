
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit, CreditCard, Users } from 'lucide-react';
import { BusinessCardCustomizer } from './BusinessCardCustomizer';
import { toast } from 'sonner';

interface BusinessCardData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export const BusinessCardTemplate: React.FC = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: '',
    title: '',
    phone: '',
    email: '',
    website: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('businessCardData');
    if (savedData) {
      try {
        setCardData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved business card data:', error);
      }
    }
  }, []);

  const handleSaveCardData = (data: BusinessCardData) => {
    setCardData(data);
    localStorage.setItem('businessCardData', JSON.stringify(data));
  };

  const handleDownloadTemplate = async () => {
    if (!cardData.name || !cardData.email) {
      toast.error('Please customize your business card first by adding at least your name and email');
      setShowCustomizer(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/supabase/functions/v1/generate-business-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentData: cardData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate business card');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-card-${cardData.name.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Business card template downloaded successfully!');
    } catch (error) {
      console.error('Error downloading business card:', error);
      toast.error('Failed to download business card template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomize = () => {
    setShowCustomizer(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-orange-500" />
              Professional Business Card Template
            </CardTitle>
            <CardDescription>
              Consistent branding with our company logo, colors, and tagline for all agents
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Template Preview</h3>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 rounded-lg text-white shadow-lg">
                  <div className="flex flex-col h-32">
                    <div className="flex items-center justify-between">
                      <img 
                        src="/lovable-uploads/1e017aad-3d36-4922-992f-f27b55733ec4.png" 
                        alt="Company Logo" 
                        className="h-8 w-auto"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <p className="text-sm font-medium opacity-90">
                        Your Partner in High-Risk Merchant Services
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-lg">
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg text-gray-900">
                      {cardData.name || '[Your Name]'}
                    </h4>
                    <p className="text-gray-600">
                      {cardData.title || '[Your Title]'}
                    </p>
                    <div className="pt-2 space-y-1 text-sm text-gray-700">
                      <p>📞 {cardData.phone || '[Your Phone Number]'}</p>
                      <p>✉️ {cardData.email || '[Your Email]'}</p>
                      <p>🌐 {cardData.website || '[Company Website]'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Template Features</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Standard Business Card Design</h4>
                      <p className="text-sm text-gray-600">3.5" x 2" standard size with front and back layouts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Customizable Agent Info</h4>
                      <p className="text-sm text-gray-600">Easy-to-edit fields for your contact details with live preview</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Print-Ready Format</h4>
                      <p className="text-sm text-gray-600">High-resolution template with proper colors and margins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Professional & Trust-Building</h4>
                      <p className="text-sm text-gray-600">Establishes credibility from the first interaction</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCustomize}
                    variant="outline" 
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button 
                    onClick={handleDownloadTemplate}
                    disabled={isGenerating}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Download Template'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Users className="h-5 w-5" />
              Usage Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-green-700">
              <p>
                <strong>Professional Printing:</strong> Use the template with any professional printer or online print service - 
                the colors and margins are pre-configured for accurate printing.
              </p>
              <p>
                <strong>Personal Touch:</strong> On the back of your card, you can jot a quick note or appointment time 
                for prospects - a personal touch plus the branded card makes a lasting impression.
              </p>
              <p>
                <strong>Always Carry:</strong> We recommend every agent carry these cards when meeting potential clients 
                or attending industry events. They're perfect leave-behinds along with the one-page flyers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BusinessCardCustomizer
        open={showCustomizer}
        onOpenChange={setShowCustomizer}
        initialData={cardData}
        onSave={handleSaveCardData}
      />
    </>
  );
};
