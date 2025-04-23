
interface ApplicationData {
  merchant_name?: string;
  application_data?: {
    business?: {
      businessName?: string;
    };
  };
}

export const useBusinessName = (businessName?: string, rawData?: { [key: string]: any }) => {
  return () => {
    if (businessName) {
      return businessName;
    }
    
    if (rawData) {
      if (rawData.merchant_name) {
        return rawData.merchant_name;
      }
      
      if (rawData.application_data?.business?.businessName) {
        return rawData.application_data.business.businessName;
      }
    }
    
    return "Unnamed Business";
  };
};
