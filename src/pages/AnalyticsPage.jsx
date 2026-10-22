import React from 'react';
import WorkloadAnalytics from '../components/Analytics/WorkloadAnalytics';

export default function AnalyticsPage({ employees = [], departments = [] }) {
  return (
    <div className="pt-4 pb-12">
      <WorkloadAnalytics employees={employees} departments={departments} />
    </div>
  );
}
