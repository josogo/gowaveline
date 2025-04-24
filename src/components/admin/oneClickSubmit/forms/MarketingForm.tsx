
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export const MarketingForm: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  
  // Get current values for each marketing channel
  const marketingChannels = watch('marketingChannels') || {};
  
  // Handle switch toggle
  const handleSwitchToggle = (channel: string, checked: boolean) => {
    setValue('marketingChannels', {
      ...marketingChannels,
      [channel]: checked
    }, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
        Marketing practices significantly impact your risk profile. 
        High-pressure sales tactics and misleading claims can lead to higher chargebacks and payment issues.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Marketing Channels</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select all marketing channels you use to acquire customers
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="facebook-ads" 
              checked={!!marketingChannels.facebookAds}
              onCheckedChange={(checked) => handleSwitchToggle('facebookAds', checked)}
            />
            <Label htmlFor="facebook-ads" className="cursor-pointer">
              Facebook/Instagram Ads
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="google-ads" 
              checked={!!marketingChannels.googleAds}
              onCheckedChange={(checked) => handleSwitchToggle('googleAds', checked)}
            />
            <Label htmlFor="google-ads" className="cursor-pointer">
              Google Ads
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="tiktok-ads" 
              checked={!!marketingChannels.tiktokAds}
              onCheckedChange={(checked) => handleSwitchToggle('tiktokAds', checked)}
            />
            <Label htmlFor="tiktok-ads" className="cursor-pointer">
              TikTok Ads
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="affiliate" 
              checked={!!marketingChannels.affiliate}
              onCheckedChange={(checked) => handleSwitchToggle('affiliate', checked)}
            />
            <Label htmlFor="affiliate" className="cursor-pointer">
              Affiliate Marketing
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="influencer" 
              checked={!!marketingChannels.influencer}
              onCheckedChange={(checked) => handleSwitchToggle('influencer', checked)}
            />
            <Label htmlFor="influencer" className="cursor-pointer">
              Influencer Marketing
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="seo" 
              checked={!!marketingChannels.seo}
              onCheckedChange={(checked) => handleSwitchToggle('seo', checked)}
            />
            <Label htmlFor="seo" className="cursor-pointer">
              SEO / Organic
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="email" 
              checked={!!marketingChannels.email}
              onCheckedChange={(checked) => handleSwitchToggle('email', checked)}
            />
            <Label htmlFor="email" className="cursor-pointer">
              Email Marketing
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="sms" 
              checked={!!marketingChannels.sms}
              onCheckedChange={(checked) => handleSwitchToggle('sms', checked)}
            />
            <Label htmlFor="sms" className="cursor-pointer">
              SMS Marketing
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="direct-mail" 
              checked={!!marketingChannels.directMail}
              onCheckedChange={(checked) => handleSwitchToggle('directMail', checked)}
            />
            <Label htmlFor="direct-mail" className="cursor-pointer">
              Direct Mail
            </Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Marketing Claims</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Certain marketing claims can trigger scrutiny from banks and payment processors
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-4">
              <h4 className="font-medium flex items-center text-amber-600">
                <XCircle className="h-4 w-4 mr-2" />
                High-Risk Claims to Avoid
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </span>
                  <span>"Guaranteed" results or outcomes</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </span>
                  <span>"Risk-free" trials or purchases</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </span>
                  <span>Medical claims or health benefits</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </span>
                  <span>Cure, treat, or prevent any disease</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-100 text-amber-800 rounded-full p-1 mr-2 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </span>
                  <span>Urgent or high-pressure sales tactics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <h4 className="font-medium flex items-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Low-Risk Alternatives
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span>"May help with..." statements</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span>"Satisfaction guarantee" with clear terms</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span>Customer testimonials with disclaimers</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span>Transparent pricing and trial terms</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span>Educational content about your products</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Claims Assessment</h3>
        <div>
          <Label>Do your marketing materials make any claims about results, outcomes, or benefits?</Label>
          <Textarea 
            placeholder="Describe any claims made in your marketing materials"
            className="mt-2"
            {...register('marketingClaims')}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Average Customer Acquisition Cost (CAC)</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              {...register('cac')} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average cost to acquire one customer
            </p>
          </div>
          
          <div>
            <Label>Customer Lifetime Value (LTV)</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              {...register('ltv')}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average value of a customer over their lifetime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingForm;
