import React from 'react';
import SmartTaskAllocator from '../components/TaskAllocator/SmartTaskAllocator';

export default function SmartTaskAllocationPage({ employees = [], onTaskAssigned }) {
  return (
    <div className="pt-4 pb-12">
      <SmartTaskAllocator 
        employees={employees} 
        onTaskAssigned={onTaskAssigned} 
      />
    </div>
  );
}
