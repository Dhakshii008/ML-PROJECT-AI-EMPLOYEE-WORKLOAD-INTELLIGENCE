import React from 'react';
import AIInsightsView from '../components/AIInsights/AIInsightsView';

export default function AIInsightsPage({ 
  insights = [], 
  onActionClick, 
  onSelectEmployee 
}) {
  return (
    <div className="pt-4 pb-12">
      <AIInsightsView 
        insights={insights} 
        onActionClick={onActionClick} 
        onSelectEmployee={onSelectEmployee} 
      />
    </div>
  );
}
