
import React from 'react';
import { Card } from '@/components/ui/card';
import AnalyticsDashboard from './AnalyticsDashboard';

export function ApplicationsAnalytics() {
  return (
    <Card className="w-full overflow-hidden border-teal-200">
      <AnalyticsDashboard />
    </Card>
  );
}

export default ApplicationsAnalytics;
