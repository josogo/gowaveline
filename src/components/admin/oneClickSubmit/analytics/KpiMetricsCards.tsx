
import React from "react";
import { AnalyticsData } from "../hooks/useAnalyticsData";
import { Check, X, Clock, AlertTriangle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const MetricCard = ({ title, value, icon, color, subtitle }: MetricCardProps) => {
  return (
    <div className={`rounded-2xl shadow-md p-5 border border-gray-100 bg-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export function KpiMetricsCards({ data }: { data: AnalyticsData }) {
  // Calculate approval rate
  const totalProcessed = data.completedApplications + data.declinedApplications;
  const approvalRate = totalProcessed ? 
    Math.round((data.completedApplications / totalProcessed) * 100) : 0;

  // Calculate decline rate
  const declineRate = totalProcessed ? 
    Math.round((data.declinedApplications / totalProcessed) * 100) : 0;
    
  // For demo purposes - in a real app, you would calculate these from your data
  const avgProcessingTime = "3.2 days";
  const fraudFlags = "12";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard 
        title="Total Applications" 
        value={data.totalApplications}
        icon={<Check size={20} className="text-green-600" />} 
        color="bg-green-50"
        subtitle={`${data.incompleteApplications} incomplete`}
      />
      
      <MetricCard 
        title="Approval Rate" 
        value={`${approvalRate}%`}
        icon={<Check size={20} className="text-green-600" />} 
        color="bg-green-50"
        subtitle={`${data.completedApplications} approved`}
      />
      
      <MetricCard 
        title="Decline Rate" 
        value={`${declineRate}%`}
        icon={<X size={20} className="text-red-600" />} 
        color="bg-red-50"
        subtitle={`${data.declinedApplications} declined`}
      />
      
      <MetricCard 
        title="Avg. Processing Time" 
        value={avgProcessingTime}
        icon={<Clock size={20} className="text-blue-600" />} 
        color="bg-blue-50"
        subtitle="From submit to decision"
      />
      
      <MetricCard 
        title="Fraud Flags" 
        value={fraudFlags}
        icon={<AlertTriangle size={20} className="text-amber-600" />} 
        color="bg-amber-50"
        subtitle="Requires review"
      />
    </div>
  );
}
