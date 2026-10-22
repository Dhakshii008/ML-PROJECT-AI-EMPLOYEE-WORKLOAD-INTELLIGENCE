import React from 'react';
import WorkloadForecast from '../components/WorkloadForecast/WorkloadForecast';

export default function WorkloadForecastPage({ employees = [], selectedEmpId = 'E104', onSelectEmployee }) {
  return (
    <div className="pt-4 pb-12">
      <WorkloadForecast 
        employees={employees} 
        selectedEmpId={selectedEmpId} 
        onSelectEmployee={onSelectEmployee} 
      />
    </div>
  );
}
