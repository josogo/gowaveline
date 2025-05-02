
import React from 'react';
import { 
  ProductCategorySection,
  FulfillmentSection, 
  ProcessingDetailsSection, 
  RecurringBillingSection 
} from './operational';

export const OperationalDetailsForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <ProductCategorySection />
      <FulfillmentSection />
      <ProcessingDetailsSection />
      <RecurringBillingSection />
    </div>
  );
};

export default OperationalDetailsForm;
