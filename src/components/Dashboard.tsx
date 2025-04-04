
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, BarChart3, CreditCard, DollarSign, Percent } from 'lucide-react';

const Dashboard = () => {
  // Placeholder data for the dashboard
  const analysisData = {
    effectiveRate: 2.95,
    processingVolume: 125750,
    chargebackRatio: 0.12,
    pricingModel: "Tiered",
    monthlyFees: 24.90,
    totalFees: 3710.56,
    savingsPotential: 925.25,
  };

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Statement Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Percent className="mr-2 h-5 w-5 text-orange-500" />
              Effective Rate
            </CardTitle>
            <CardDescription>Total fees / total volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{analysisData.effectiveRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">Industry average: 2.3-2.5%</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-red-500 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>0.45% higher than average</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-teal-500" />
              Processing Volume
            </CardTitle>
            <CardDescription>Total monthly sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-500">
              ${analysisData.processingVolume.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Last month: $118,245</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>6.3% increase from last month</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-orange-500" />
              Pricing Model
            </CardTitle>
            <CardDescription>Your current pricing structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{analysisData.pricingModel}</div>
            <p className="text-sm text-muted-foreground mt-1">Recommended: Interchange Plus</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-amber-500 text-sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span>Consider switching for better rates</span>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Fee Breakdown</h3>
        <div className="glass-card p-6">
          <div className="text-center mb-6">
            <p className="text-lg mb-2">You're being charged a <span className="font-semibold">${analysisData.monthlyFees.toFixed(2)}</span> monthly fee</p>
            <p className="text-muted-foreground">This includes a $9.95 statement fee and a $14.95 PCI compliance fee</p>
          </div>
          
          <div className="space-y-4">
            <div className="h-10 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 flex items-center pl-3"
                style={{ width: '65%' }}
              >
                <span className="text-white text-sm font-medium">Transaction Fees (65%)</span>
              </div>
            </div>
            
            <div className="h-10 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 flex items-center pl-3"
                style={{ width: '22%' }}
              >
                <span className="text-white text-sm font-medium">Interchange Fees (22%)</span>
              </div>
            </div>
            
            <div className="h-10 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 flex items-center pl-3"
                style={{ width: '13%' }}
              >
                <span className="text-white text-sm font-medium">Monthly Fees (13%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center my-12">
        <h3 className="text-2xl font-bold mb-4">Savings Opportunity</h3>
        <p className="text-xl mb-6">You could save approximately <span className="font-bold text-teal-500">${analysisData.savingsPotential.toLocaleString()}</span> per year</p>
        <Button className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-6 text-lg rounded-md">
          Get Personalized Recommendations
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
