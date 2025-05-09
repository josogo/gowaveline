
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MerchantLoginForm } from '@/components/admin/oneClickSubmit/MerchantLoginForm';
import ApplicationFlow from '@/components/admin/oneClickSubmit/ApplicationFlow';
import { toast } from 'sonner';

const MerchantApplication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [merchantApp, setMerchantApp] = useState<any>(null);
  const { applicationId } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const handleSuccessfulLogin = (appData: any) => {
    console.log("Login successful, application data:", appData);
    setIsAuthenticated(true);
    setMerchantApp(appData || null);
  };

  const handleClose = () => {
    // Show success toast before redirecting
    toast.success("Application progress saved successfully");
    // Redirect to homepage or previous page
    console.log("Closing merchant application");
    window.history.back();
  };

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
            onSuccessfulLogin={handleSuccessfulLogin}
            applicationId={applicationId}
          />
        </div>
      ) : (
        // Pass application data if authenticated
        <ApplicationFlow 
          merchantApplication={merchantApp} 
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default MerchantApplication;
