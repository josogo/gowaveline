
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export function FunnelAnalytics({ data }: { data: AnalyticsData }) {
  if (!data.stepDropoffs || data.stepDropoffs.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Application Funnel Analysis</h3>
        <p className="text-muted-foreground mt-2">
          No funnel data available for the selected time period.
        </p>
      </div>
    );
  }

  // Format the data for the chart
  const funnelData = data.stepDropoffs.map(step => ({
    name: step.step,
    dropoff: step.dropoff
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Application Step Dropoff Analysis</h3>
      <p className="text-sm text-muted-foreground">
        Percentage of users who abandon the application at each step
      </p>

      <div className="h-80">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Dropoff %', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Dropoff Rate']} />
              <Legend />
              <Bar 
                dataKey="dropoff" 
                name="Dropoff Rate %" 
                fill="#3b82f6"
              >
                {funnelData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.dropoff > 30 ? '#ef4444' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium mb-2">Form Optimization Insights</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {funnelData
            .filter(step => step.dropoff > 20)
            .map((step, index) => (
              <li key={index}>
                High dropoff rate ({step.dropoff}%) at the <strong>{step.name}</strong> step - 
                consider simplifying this section
              </li>
            ))}
          {funnelData.filter(step => step.dropoff > 20).length === 0 && (
            <li>No significant form dropoff issues detected</li>
          )}
        </ul>
      </div>
    </div>
  );
}
