
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessDetailsForm } from './forms/BusinessDetailsForm';
import { OwnershipForm } from './forms/OwnershipForm';
import { OperationalDetailsForm } from './forms/OperationalDetailsForm';
import { MarketingForm } from './forms/MarketingForm';
import { FinancialInfoForm } from './forms/FinancialInfoForm';
import { ProcessingInfoForm } from './forms/ProcessingInfoForm';
import { DocumentsForm } from './forms/DocumentsForm';
import { BankRoutingSystem } from './BankRoutingSystem';
import { ArrowRight, ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { MerchantInitialForm } from './forms/MerchantInitialForm';

export const ApplicationFlow: React.FC = () => {
  const [step, setStep] = useState<"init" | "main">("init");
  const [initialData, setInitialData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('business');
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [showBankRouting, setShowBankRouting] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'business', label: 'Business' },
    { id: 'ownership', label: 'Owners' },
    { id: 'operations', label: 'Operations' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'financial', label: 'Financial' },
    { id: 'processing', label: 'Processing' },
    { id: 'documents', label: 'Documents' },
  ];
  
  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      setApplicationProgress(Math.min(100, ((currentIndex + 2) / tabs.length) * 100));
    } else {
      setShowBankRouting(true);
    }
  };
  
  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      setApplicationProgress(Math.max(0, ((currentIndex) / tabs.length) * 100));
    }
  };

  const handleSaveDraft = () => {
    toast.success("Application draft saved successfully");
  };

  const handleInitialNext = (values: any) => {
    setInitialData(values);
    setStep("main");
  };

  if (showBankRouting) {
    return <BankRoutingSystem onBack={() => setShowBankRouting(false)} />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Merchant Application</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${applicationProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Application Progress</span>
              <span>{Math.round(applicationProgress)}%</span>
            </div>
          </div>
          
          {step === "init" ? (
            <MerchantInitialForm onNext={handleInitialNext} />
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-7 w-full mb-6">
                  {tabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="text-xs sm:text-sm"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="business">
                  <BusinessDetailsForm />
                </TabsContent>
                
                <TabsContent value="ownership">
                  <OwnershipForm />
                </TabsContent>
                
                <TabsContent value="operations">
                  <OperationalDetailsForm />
                </TabsContent>
                
                <TabsContent value="marketing">
                  <MarketingForm />
                </TabsContent>
                
                <TabsContent value="financial">
                  <FinancialInfoForm />
                </TabsContent>
                
                <TabsContent value="processing">
                  <ProcessingInfoForm />
                </TabsContent>
                
                <TabsContent value="documents">
                  <DocumentsForm />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={activeTab === 'business'}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  
                  <Button onClick={handleNext}>
                    {activeTab === 'documents' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationFlow;
