
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StatementAnalysis } from '@/services/statementService';

interface DashboardProps {
  analysisData: StatementAnalysis;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisData }) => {
  // Example fee breakdown data for visualization
  const feeBreakdown = [
    { name: 'Processing Fees', value: 78 },
    { name: 'Monthly Fee', value: 8 },
    { name: 'PCI Fee', value: 12 },
    { name: 'Other Fees', value: 2 },
  ];

  const feeColors = ['#f97316', '#14b8a6', '#22c55e', '#64748b'];

  // Monthly transaction data
  const monthlyData = [
    { month: 'Jan', volume: 98000 },
    { month: 'Feb', volume: 107000 },
    { month: 'Mar', volume: 125000 },
    { month: 'Apr', volume: 118000 },
    { month: 'May', volume: 130000 },
    { month: 'Jun', volume: 125780 },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {analysisData.isMockData && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Demonstration Data</AlertTitle>
          <AlertDescription>
            You are viewing sample data for demonstration purposes. This is not based on your actual statement.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Effective Rate</CardTitle>
            <CardDescription>Overall processing cost</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{analysisData.effectiveRate}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Industry average is 2.5-3.0%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Volume</CardTitle>
            <CardDescription>Total processed amount</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-500">{analysisData.monthlyVolume}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Last month: $118,450
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pricing Model</CardTitle>
            <CardDescription>Your pricing structure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{analysisData.pricingModel}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Interchange-plus typically saves 15-30%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Chargeback Ratio</CardTitle>
            <CardDescription>Disputes percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-500">{analysisData.chargebackRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Well below industry average (0.60%)
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Fee Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
            <CardDescription>
              Visual representation of your fee distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {feeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={feeColors[index % feeColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Processing Volume</CardTitle>
            <CardDescription>
              Your monthly transaction volume for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Volume']} />
                <Bar dataKey="volume" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Fee Details */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Details</CardTitle>
          <CardDescription>
            Breakdown of all fees from your merchant statement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium">Monthly Fee</h3>
                <p className="text-2xl font-bold text-orange-500">{analysisData.fees.monthlyFee}</p>
                <p className="text-sm text-muted-foreground mt-1">Account maintenance fee</p>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-medium">PCI Compliance Fee</h3>
                <p className="text-2xl font-bold text-teal-500">{analysisData.fees.pciFee}</p>
                <p className="text-sm text-muted-foreground mt-1">Security compliance cost</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium">Statement Fee</h3>
                <p className="text-2xl font-bold text-orange-500">{analysisData.fees.statementFee}</p>
                <p className="text-sm text-muted-foreground mt-1">Paper statement charge</p>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-medium">Batch Fee</h3>
                <p className="text-2xl font-bold text-teal-500">{analysisData.fees.batchFee}</p>
                <p className="text-sm text-muted-foreground mt-1">Per batch settlement</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium">Transaction Fees</h3>
                <p className="text-2xl font-bold text-orange-500">{analysisData.fees.transactionFees}</p>
                <p className="text-sm text-muted-foreground mt-1">Per transaction cost</p>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-medium">Potential Savings</h3>
                <p className="text-2xl font-bold text-teal-500">$175-$320</p>
                <p className="text-sm text-muted-foreground mt-1">Estimated monthly savings</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-orange-800">Analysis Summary</h3>
              <p className="mt-2">
                Based on your {analysisData.pricingModel} pricing model with an effective rate of {analysisData.effectiveRate}, we estimate you could save approximately 15-25% on your processing costs by switching to an interchange-plus pricing model. Additionally, some of your non-processing fees like PCI compliance ({analysisData.fees.pciFee}) and statement fee ({analysisData.fees.statementFee}) are higher than the industry standard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
