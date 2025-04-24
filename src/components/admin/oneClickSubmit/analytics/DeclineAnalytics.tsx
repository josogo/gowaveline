
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function DeclineAnalytics({ data }: { data: AnalyticsData }) {
  // Sort reasons by count and get top reasons
  const topReasons = [...data.declineReasons]
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
    .map(item => ({
      name: item.reason.length > 20 ? item.reason.substring(0, 20) + '...' : item.reason,
      count: item.count
    }));

  // If there are no decline reasons, show a message
  if (topReasons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No decline data available for the selected time period
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topReasons}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }} 
                width={120}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="count" 
                name="Applications" 
                fill="#ef4444" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-red-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-red-900 mb-2">Top Issue</h4>
          <p className="text-sm text-red-700">
            {topReasons.length > 0 ? topReasons[0].name : "No issues found"}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendation</h4>
          <p className="text-sm text-blue-700">
            Update application fields to reduce the most common errors
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-amber-900 mb-2">Alert</h4>
          <p className="text-sm text-amber-700">
            {topReasons.length > 0 && topReasons[0].count > 5 
              ? `${topReasons[0].name} has a high occurrence rate` 
              : "No significant issues detected"}
          </p>
        </div>
      </div>
    </div>
  );
}
