
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';

export const MarketingChannels = () => {
  const { watch, setValue } = useFormContext();
  const marketingChannels = watch('marketingChannels') || {};
  
  const handleSwitchToggle = (channel: string, checked: boolean) => {
    setValue('marketingChannels', {
      ...marketingChannels,
      [channel]: checked
    }, { shouldDirty: true });
  };

  const channels = [
    { id: 'facebookAds', label: 'Facebook/Instagram Ads' },
    { id: 'googleAds', label: 'Google Ads' },
    { id: 'tiktokAds', label: 'TikTok Ads' },
    { id: 'affiliate', label: 'Affiliate Marketing' },
    { id: 'influencer', label: 'Influencer Marketing' },
    { id: 'seo', label: 'SEO / Organic' },
    { id: 'email', label: 'Email Marketing' },
    { id: 'sms', label: 'SMS Marketing' },
    { id: 'directMail', label: 'Direct Mail' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Marketing Channels</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Select all marketing channels you use to acquire customers
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {channels.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Switch 
              id={id}
              checked={!!marketingChannels[id]}
              onCheckedChange={(checked) => handleSwitchToggle(id, checked)}
            />
            <Label htmlFor={id} className="cursor-pointer">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
