
import React from 'react';
import { StatementAnalysis } from '@/services/statementService';
import MetricCard from '@/components/dashboard/MetricCard';
import FeeBreakdownChart from '@/components/dashboard/FeeBreakdownChart';
import VolumeChart from '@/components/dashboard/VolumeChart';
import FeeDetails from '@/components/dashboard/FeeDetails';
import DemoDataAlert from '@/components/dashboard/DemoDataAlert';
import { feeBreakdown, monthlyData } from '@/components/dashboard/mockData';

interface DashboardProps {
  analysisData: StatementAnalysis;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisData }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      {analysisData.isMockData && <DemoDataAlert />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Effective Rate"
          description="Overall processing cost"
          value={analysisData.effectiveRate}
          additionalInfo="Industry average is 2.5-3.0%"
          valueClassName="text-orange-500"
        />
        
        <MetricCard
          title="Monthly Volume"
          description="Total processed amount"
          value={analysisData.monthlyVolume}
          additionalInfo="Last month: $118,450"
          valueClassName="text-teal-500"
        />
        
        <MetricCard
          title="Pricing Model"
          description="Your pricing structure"
          value={analysisData.pricingModel}
          additionalInfo="Interchange-plus typically saves 15-30%"
          valueClassName="text-orange-500"
        />
        
        <MetricCard
          title="Chargeback Ratio"
          description="Disputes percentage"
          value={analysisData.chargebackRatio}
          additionalInfo="Well below industry average (0.60%)"
          valueClassName="text-teal-500"
        />
      </div>
      
      {/* Fee Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FeeBreakdownChart data={feeBreakdown} />
        <VolumeChart data={monthlyData} />
      </div>
      
      {/* Fee Details */}
      <FeeDetails 
        fees={analysisData.fees} 
        pricingModel={analysisData.pricingModel} 
        effectiveRate={analysisData.effectiveRate} 
      />
    </div>
  );
};

export default Dashboard;
