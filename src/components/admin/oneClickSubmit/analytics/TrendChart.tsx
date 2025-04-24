
import React, { useState } from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';

export function TrendChart({ data }: { data: AnalyticsData }) {
  const [chartView, setChartView] = useState<'total' | 'daily'>('total');
  const [viewType, setViewType] = useState<'combined' | 'split'>('combined');

  // Format the dates for better display
  const trendData = data.applicationTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count,
    // Using the demo data pattern but with more realistic ratios
    approved: Math.floor(item.count * 0.65),
    declined: Math.floor(item.count * 0.35)
  }));

  if (trendData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No trend data available for the selected time period
      </div>
    );
  }

  const totalVolume = trendData.reduce((sum, item) => sum + item.count, 0);
  const avgDaily = (totalVolume / trendData.length).toFixed(1);
  const highestDay = trendData.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <ToggleGroup type="single" value={chartView} onValueChange={(value) => value && setChartView(value as 'total' | 'daily')}>
          <ToggleGroupItem value="total" aria-label="Show total applications">
            Total Volume
          </ToggleGroupItem>
          <ToggleGroupItem value="daily" aria-label="Show daily breakdown">
            Daily Breakdown
          </ToggleGroupItem>
        </ToggleGroup>

        {chartView === 'daily' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType(current => current === 'combined' ? 'split' : 'combined')}
          >
            {viewType === 'combined' ? 'Show Separately' : 'Combine View'}
          </Button>
        )}
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
                  name="Total Applications"
                  stroke="#3b82f6"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ) : viewType === 'combined' ? (
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
              ) : (
                <Line
                  type="monotone"
                  dataKey={viewType === 'split' ? 'approved' : 'declined'}
                  name={viewType === 'split' ? 'Approved' : 'Declined'}
                  stroke={viewType === 'split' ? '#10b981' : '#ef4444'}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
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

