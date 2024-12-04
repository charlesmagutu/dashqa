// DashboardOverview.tsx
import React from 'react';

const Overview: React.FC = () => (
  <div className="p-6">
    <h2 className="text-3xl font-bold mb-6">Co-op Bank QA Department</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Total Test Runs</h3>
        <p className="text-4xl font-bold text-blue-600">254</p>
        <p className="text-sm text-green-600">+12% from last month</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Automation Coverage</h3>
        <p className="text-4xl font-bold text-green-600">78%</p>
        <p className="text-sm text-gray-600">Automated Test Cases</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Defect Rate</h3>
        <p className="text-4xl font-bold text-red-600">3.5%</p>
        <p className="text-sm text-gray-600">Defects per Test Run</p>
      </div>
    </div>
  </div>
);

export default Overview;
