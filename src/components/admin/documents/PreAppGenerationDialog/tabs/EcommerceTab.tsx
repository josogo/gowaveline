
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  TransactionMethodsSection,
  ShippingSection,
  PaymentSection,
  InternationalSection
} from './ecommerce';

interface EcommerceTabProps {
  form: UseFormReturn<any>;
  goToPrevTab: () => void;
}

export const EcommerceTab: React.FC<EcommerceTabProps> = ({ form, goToPrevTab }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">eCommerce Information</h3>
        <p className="text-sm text-gray-500 mb-4">Enter details about your online business operations</p>

        <div className="grid grid-cols-1 gap-4">
          {/* Transaction Methods Section */}
          <TransactionMethodsSection form={form} />
          
          {/* Shipping Section */}
          <ShippingSection form={form} />
          
          {/* Payment Section */}
          <PaymentSection form={form} />
          
          {/* International Section */}
          <InternationalSection form={form} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPrevTab}>
          Previous
        </Button>
        <Button type="submit" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
          Generate Application
        </Button>
      </div>
    </div>
  );
};
