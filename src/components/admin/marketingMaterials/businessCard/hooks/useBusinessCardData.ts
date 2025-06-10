
import { useState, useEffect } from 'react';

interface BusinessCardData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export const useBusinessCardData = () => {
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: '',
    title: '',
    phone: '',
    email: '',
    website: ''
  });

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

  const saveCardData = (data: BusinessCardData) => {
    setCardData(data);
    localStorage.setItem('businessCardData', JSON.stringify(data));
  };

  return { cardData, saveCardData };
};
