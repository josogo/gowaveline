
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { BusinessCardCustomizer } from './BusinessCardCustomizer';
import { 
  BusinessCardPreview, 
  BusinessCardFeatures, 
  BusinessCardUsageTips,
  useBusinessCardData,
  useBusinessCardDownload
} from './businessCard';

export const BusinessCardTemplate: React.FC = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { cardData, saveCardData } = useBusinessCardData();
  const { isGenerating, downloadTemplate } = useBusinessCardDownload();

  const handleDownloadTemplate = () => {
    downloadTemplate(cardData, () => setShowCustomizer(true));
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
              <BusinessCardPreview cardData={cardData} />
              <BusinessCardFeatures
                onCustomize={handleCustomize}
                onDownload={handleDownloadTemplate}
                isGenerating={isGenerating}
              />
            </div>
          </CardContent>
        </Card>

        <BusinessCardUsageTips />
      </div>

      <BusinessCardCustomizer
        open={showCustomizer}
        onOpenChange={setShowCustomizer}
        initialData={cardData}
        onSave={saveCardData}
      />
    </>
  );
};
