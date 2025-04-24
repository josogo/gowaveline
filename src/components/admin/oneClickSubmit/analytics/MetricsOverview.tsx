
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';

type MetricCardProps = {
  title: string;
  value: number | string;
  description?: string;
  color?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, color }) => {
  return (
    <div className={`p-4 rounded-lg border ${color || 'bg-card'}`}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};

export function MetricsOverview({ data }: { data: AnalyticsData }) {
  // Calculate approval rate
  const totalProcessed = data.completedApplications + data.declinedApplications;
  const approvalRate = totalProcessed ? 
    Math.round((data.completedApplications / totalProcessed) * 100) : 0;

  // Calculate decline rate
  const declineRate = totalProcessed ? 
    Math.round((data.declinedApplications / totalProcessed) * 100) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Key Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Applications" 
          value={data.totalApplications} 
        />
        <MetricCard 
          title="Approval Rate" 
          value={`${approvalRate}%`}
          description={`${data.completedApplications} applications completed`}
          color={approvalRate > 70 ? "border-green-200 bg-green-50 dark:bg-green-950/30" : ""}
        />
        <MetricCard 
          title="Decline Rate" 
          value={`${declineRate}%`} 
          description={`${data.declinedApplications} applications declined`}
          color={declineRate > 30 ? "border-red-200 bg-red-50 dark:bg-red-950/30" : ""}
        />
        <MetricCard 
          title="Incomplete Applications" 
          value={data.incompleteApplications} 
          description="Applications not yet completed"
          color="border-amber-200 bg-amber-50 dark:bg-amber-950/30"
        />
      </div>
    </div>
  );
}
