
import React, { useState } from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';

export function TrendChart({ data }: { data: AnalyticsData }) {
  const [chartView, setChartView] = useState<'total' | 'daily'>('total');

  // Format the dates for better display
  const trendData = data.applicationTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count,
    // Demo data for chart filtering - in a real app, this would come from your analytics data
    approved: Math.floor(item.count * 0.7),
    declined: Math.floor(item.count * 0.3)
  }));

  if (trendData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No trend data available for the selected time period
      </div>
    );
  }

  const totalVolume = trendData.reduce((sum, item) => sum + item.count, 0);
  const avgDaily = (trendData.reduce((sum, item) => sum + item.count, 0) / trendData.length).toFixed(1);
  const highestDay = trendData.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`${chartView === 'total' 
              ? 'bg-white shadow-sm' 
              : 'hover:bg-gray-200'} px-3 py-1 h-8`}
            onClick={() => setChartView('total')}
          >
            Total
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${chartView === 'daily' 
              ? 'bg-white shadow-sm' 
              : 'hover:bg-gray-200'} px-3 py-1 h-8`}
            onClick={() => setChartView('daily')}
          >
            Daily Breakdown
          </Button>
        </div>
      </div>

      <div className="h-64">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {chartView === 'total' ? (
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Applications"
                  stroke="#3b82f6"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="approved"
                    name="Approved"
                    stroke="#10b981"
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="declined"
                    name="Declined"
                    stroke="#ef4444"
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Total Volume</h4>
          <p className="text-lg font-bold text-blue-800">{totalVolume}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-green-900 mb-1">Average Daily</h4>
          <p className="text-lg font-bold text-green-800">{avgDaily}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-amber-900 mb-1">Highest Day</h4>
          <p className="text-lg font-bold text-amber-800">{highestDay}</p>
        </div>
      </div>
    </div>
  );
}
