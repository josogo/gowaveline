
import React from 'react';
import { Card } from '@/components/ui/card';
import AnalyticsDashboard from './AnalyticsDashboard';

export function ApplicationsAnalytics() {
  console.log("ApplicationsAnalytics component rendering");
  return (
    <Card className="w-full overflow-hidden">
      <AnalyticsDashboard />
    </Card>
  );
}

export default ApplicationsAnalytics;
