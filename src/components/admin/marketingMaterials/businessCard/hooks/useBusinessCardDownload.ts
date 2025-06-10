
import { useState } from 'react';
import { toast } from 'sonner';

interface BusinessCardData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export const useBusinessCardDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadTemplate = async (cardData: BusinessCardData, onShowCustomizer: () => void) => {
    if (!cardData.name || !cardData.email) {
      toast.error('Please customize your business card first by adding at least your name and email');
      onShowCustomizer();
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/generate-business-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'}`,
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

  return { isGenerating, downloadTemplate };
};
