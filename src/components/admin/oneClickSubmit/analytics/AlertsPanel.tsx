
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalyticsData } from '../hooks/useAnalyticsData';

interface AlertsPanelProps {
  data: AnalyticsData;
}

export function AlertsPanel({ data }: AlertsPanelProps) {
  // Calculate insights from the data
  const getAlerts = () => {
    const alerts = [];
    
    // Check for high decline rate
    const totalProcessed = data.completedApplications + data.declinedApplications;
    const declineRate = totalProcessed ? 
      Math.round((data.declinedApplications / totalProcessed) * 100) : 0;
    
    if (declineRate > 30) {
      alerts.push({
        type: 'warning',
        title: 'High Decline Rate',
        description: `Current decline rate is ${declineRate}%, which is above the recommended threshold of 30%.`,
        icon: <TrendingUp className="h-5 w-5 text-amber-600" />
      });
    }

    // Check for dropoff issues in the funnel
    const highDropoffSteps = data.stepDropoffs?.filter(step => step.dropoff > 25) || [];
    if (highDropoffSteps.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'High Application Dropoff',
        description: `${highDropoffSteps.length} steps have dropout rates exceeding 25%. Review form complexity.`,
        icon: <TrendingDown className="h-5 w-5 text-amber-600" />
      });
    }

    // Check for incomplete applications
    const incompleteRate = Math.round((data.incompleteApplications / data.totalApplications) * 100);
    if (incompleteRate > 40) {
      alerts.push({
        type: 'warning',
        title: 'High Incomplete Rate',
        description: `${incompleteRate}% of applications remain incomplete. Consider follow-up campaigns.`,
        icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  if (alerts.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertTitle className="text-green-800 flex items-center gap-2">
          All Metrics Within Normal Range
        </AlertTitle>
        <AlertDescription className="text-green-700">
          No significant issues detected in the current analytics data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Alert key={index} className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800 flex items-center gap-2">
            {alert.icon}
            {alert.title}
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            {alert.description}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
