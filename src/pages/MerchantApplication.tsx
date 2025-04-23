
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MerchantLoginForm } from '@/components/admin/oneClickSubmit/MerchantLoginForm';
import { ApplicationFlow } from '@/components/admin/oneClickSubmit/ApplicationFlow';

const MerchantApplication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { applicationId } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="container mx-auto py-8 px-4">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold mb-2">WaveLine Merchant Application</h1>
            <p className="text-gray-600">
              Complete your payment processing application
            </p>
          </div>
          <MerchantLoginForm 
            onSuccessfulLogin={() => setIsAuthenticated(true)} 
            applicationId={applicationId}
          />
        </div>
      ) : (
        <ApplicationFlow />
      )}
    </div>
  );
};

export default MerchantApplication;
