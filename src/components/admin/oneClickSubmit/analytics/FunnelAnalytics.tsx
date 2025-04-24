
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export function FunnelAnalytics({ data }: { data: AnalyticsData }) {
  if (!data.stepDropoffs || data.stepDropoffs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No funnel data available for the selected time period
      </div>
    );
  }

  // Format the data for the chart
  const funnelData = data.stepDropoffs.map(step => ({
    name: step.step,
    dropoff: step.dropoff
  }));

  // Identify steps with high dropoff rates
  const highDropoffSteps = funnelData.filter(step => step.dropoff > 25);

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                label={{ 
                  value: 'Dropoff %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: '#64748b' }
                }} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="dropoff" 
                name="Dropoff Rate %" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              >
                {funnelData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.dropoff > 25 ? '#ef4444' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {highDropoffSteps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-900">High Dropoff Steps Detected</h4>
              <ul className="mt-2 space-y-1">
                {highDropoffSteps.map((step, index) => (
                  <li key={index} className="text-sm text-amber-800 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-amber-600 rounded-full"></span>
                    <strong>{step.name}</strong>: {step.dropoff}% of users abandon at this step
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-700 mt-3">
                Consider simplifying these steps to improve completion rates
              </p>
            </div>
          </div>
        </div>
      )}

      {highDropoffSteps.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <div className="p-1 bg-green-200 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-700">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900">No Significant Dropoff Issues</h4>
              <p className="text-xs text-green-700 mt-1">
                All steps have acceptable completion rates
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
