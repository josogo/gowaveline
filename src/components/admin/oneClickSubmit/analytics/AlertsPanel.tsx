
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown, Check, Bell, BarChart3 } from 'lucide-react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface AlertsPanelProps {
  data: AnalyticsData;
}

export function AlertsPanel({ data }: AlertsPanelProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  
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
        icon: <TrendingUp className="h-5 w-5 text-amber-600" />,
        actionable: 'Review decline reasons and consider adjusting qualification criteria.',
        priority: 'high'
      });
    }

    // Check for dropoff issues in the funnel
    const highDropoffSteps = data.stepDropoffs?.filter(step => step.dropoff > 25) || [];
    if (highDropoffSteps.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'High Application Dropoff',
        description: `${highDropoffSteps.length} ${highDropoffSteps.length === 1 ? 'step has' : 'steps have'} dropout rates exceeding 25%.`,
        icon: <TrendingDown className="h-5 w-5 text-amber-600" />,
        actionable: 'Simplify form fields or add more guidance in problem areas.',
        details: highDropoffSteps.map(step => `${step.step}: ${step.dropoff}% dropoff`),
        priority: 'medium'
      });
    }

    // Check for incomplete applications
    const incompleteRate = Math.round((data.incompleteApplications / data.totalApplications) * 100);
    if (incompleteRate > 40) {
      alerts.push({
        type: 'warning',
        title: 'High Incomplete Rate',
        description: `${incompleteRate}% of applications remain incomplete.`,
        icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
        actionable: 'Consider implementing follow-up email campaigns or notification reminders.',
        priority: 'medium'
      });
    }
    
    // Check for processing time issues
    if (data.averageCompletionTime && data.averageCompletionTime > 4) {
      alerts.push({
        type: 'warning',
        title: 'High Processing Time',
        description: `Average completion time is ${data.averageCompletionTime.toFixed(1)} days.`,
        icon: <Bell className="h-5 w-5 text-amber-600" />,
        actionable: 'Review processing workflow for bottlenecks.',
        priority: 'low'
      });
    }
    
    // Check for positive trends
    if (declineRate < 15 && totalProcessed > 10) {
      alerts.push({
        type: 'success',
        title: 'Low Decline Rate',
        description: `Current decline rate of ${declineRate}% is below average.`,
        icon: <Check className="h-5 w-5 text-green-600" />,
        actionable: 'Current approval processes are working effectively.',
        priority: 'info'
      });
    }

    // Add volume insights if we have trend data
    if (data.applicationTrend && data.applicationTrend.length > 7) {
      const recentTrend = data.applicationTrend.slice(-7);
      const totalRecent = recentTrend.reduce((sum, day) => sum + day.count, 0);
      const avgDaily = totalRecent / recentTrend.length;
      
      if (avgDaily < 2) {
        alerts.push({
          type: 'warning',
          title: 'Low Application Volume',
          description: `Average of ${avgDaily.toFixed(1)} applications per day in the last week.`,
          icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
          actionable: 'Consider increasing marketing efforts or application visibility.',
          priority: 'medium'
        });
      }
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3, info: 4 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  };

  const alerts = getAlerts();

  if (alerts.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200 rounded-xl shadow-sm">
        <AlertTitle className="text-green-800 flex items-center gap-2">
          <Check className="h-5 w-5" />
          All Metrics Within Normal Range
        </AlertTitle>
        <AlertDescription className="text-green-700">
          No significant issues detected in the current analytics data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert 
            key={index} 
            className={`
              border rounded-xl shadow-sm 
              ${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}
            `}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <AlertTitle className={`
                  flex items-center gap-2 
                  ${alert.type === 'success' ? 'text-green-800' : 'text-amber-800'}
                `}>
                  {alert.icon}
                  {alert.title}
                </AlertTitle>
                <AlertDescription className={`
                  ${alert.type === 'success' ? 'text-green-700' : 'text-amber-700'}
                `}>
                  {alert.description}
                </AlertDescription>
                
                {alert.actionable && (
                  <p className={`text-sm mt-1 font-medium
                    ${alert.type === 'success' ? 'text-green-600' : 'text-amber-600'}`
                  }>
                    <strong>Recommended action:</strong> {alert.actionable}
                  </p>
                )}
                
                {alert.details && showDetails && (
                  <div className="mt-2 pl-2 border-l-2 border-amber-300">
                    {alert.details.map((detail, i) => (
                      <p key={i} className="text-sm text-amber-700">{detail}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {alerts.some(alert => alert.details) && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      )}
    </div>
  );
}
