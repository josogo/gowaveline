
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FeeBreakdownProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const FeeBreakdownChart: React.FC<FeeBreakdownProps> = ({ data }) => {
  const feeColors = ['#f97316', '#14b8a6', '#22c55e', '#64748b'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Breakdown</CardTitle>
        <CardDescription>
          Visual representation of your fee distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={feeColors[index % feeColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FeeBreakdownChart;
