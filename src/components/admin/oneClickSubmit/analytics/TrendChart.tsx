
import React, { useState } from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function TrendChart({ data }: { data: AnalyticsData }) {
  const [chartView, setChartView] = useState<'total' | 'daily'>('total');
  const [viewType, setViewType] = useState<'combined' | 'split'>('combined');
  const isMobile = useIsMobile();

  const trendData = data.applicationTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short',
      day: isMobile ? 'numeric' : '2-digit'
    }),
    count: item.count,
    approved: Math.floor(item.count * 0.65),
    declined: Math.floor(item.count * 0.35)
  }));

  if (trendData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No trend data available
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
          <ToggleGroupItem value="total" aria-label="Show total applications" className="text-sm">
            Total
          </ToggleGroupItem>
          <ToggleGroupItem value="daily" aria-label="Show daily breakdown" className="text-sm">
            Daily
          </ToggleGroupItem>
        </ToggleGroup>

        {chartView === 'daily' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType(current => current === 'combined' ? 'split' : 'combined')}
            className="text-sm"
          >
            {viewType === 'combined' ? 'Split View' : 'Combined'}
          </Button>
        )}
      </div>

      <div className={`h-${isMobile ? '48' : '64'}`}>
        <ChartContainer config={{}}>
          <ResponsiveContainer>
            <LineChart
              data={trendData}
              margin={{ 
                top: 10, 
                right: isMobile ? 5 : 10, 
                left: isMobile ? 0 : 10, 
                bottom: isMobile ? 30 : 20 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: isMobile ? 10 : 11 }}
                angle={-45}
                textAnchor="end"
                height={isMobile ? 60 : 50}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fontSize: isMobile ? 10 : 11 }}
                width={isMobile ? 30 : 40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {chartView === 'total' ? (
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={!isMobile}
                  activeDot={{ r: 6 }}
                />
              ) : viewType === 'combined' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="approved"
                    name="Approved"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={!isMobile}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="declined"
                    name="Declined"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={!isMobile}
                    activeDot={{ r: 6 }}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey={viewType === 'split' ? 'approved' : 'declined'}
                  name={viewType === 'split' ? 'Approved' : 'Declined'}
                  stroke={viewType === 'split' ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  dot={!isMobile}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Total Volume</h4>
          <p className="text-lg font-bold text-blue-800">{totalVolume}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-green-900 mb-1">Daily Average</h4>
          <p className="text-lg font-bold text-green-800">{avgDaily}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl">
          <h4 className="text-sm font-medium text-amber-900 mb-1">Peak Day</h4>
          <p className="text-lg font-bold text-amber-800">{highestDay}</p>
        </div>
      </div>
    </div>
  );
}
